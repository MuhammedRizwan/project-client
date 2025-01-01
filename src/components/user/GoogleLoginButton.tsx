"use client";

import { Button } from "@nextui-org/react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { addUser } from "@/store/reducer/userReducer";
import { google_login } from "@/config/user/authservice";

// Define types for user data that will be fetched
interface UserProfile {
  email: string;
  name: string;
  picture: string;
}

interface GoogleLoginData {
  access_token: string;
}

export default function GoogleLoginButton() {
  const [user, setUser] = useState<GoogleLoginData | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  // Trigger login with Google OAuth
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => {
      console.error("Login Failed:", error);
      toast.error("Google login failed");
    },
  });

  useEffect(() => {
    if (user) {
      // Fetch user profile with the access token
      axios
        .get<UserProfile>(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: "application/json",
          },
        })
        .then((response) => {
          // After fetching user profile, send it to your backend for login
          const handleServerLogin = async () => {
            try {
              const res = await google_login({
                email: response.data.email,
                name: response.data.name,
                picture: response.data.picture,
              });

              if (res.success) {
                const { user, refreshToken, accessToken } = res;
                // Set tokens in cookies
                Cookies.set("refreshToken", refreshToken);
                Cookies.set("accessToken", accessToken);

                // Update Redux store with user data
                dispatch(addUser(user));

                // Provide success feedback
                toast.success(res.message);
                router.push("/"); // Redirect to homepage after login
              } else {
                toast.error(res.message); // Error message from the server
              }
            } catch (error) {
              // Handle errors from server
              if (axios.isAxiosError(error)) {
                if (error.response && error.response.data.redirect) {
                  toast.error(error.response.data.message);
                  router.push("/login"); // Redirect to login page
                } else {
                  toast.error("Error during login request");
                }
              } else {
                toast.error("An unexpected error occurred during login");
              }
            }
          };

          handleServerLogin();
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          toast.error("Failed to fetch user profile");
        });
    }
  }, [user, dispatch, router]);

  return (
    <div className="text-slate-500 font-semibold w-1/2 flex">
      <Button onClick={() => login()}>
        <FcGoogle className="m-1" />
        Sign in with Google
      </Button>
    </div>
  );
}

