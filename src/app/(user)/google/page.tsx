"use client";
import { google_login } from "@/config/user/authservice";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { addUser } from "@/store/reducer/userReducer";
import toast from "react-hot-toast";
import axios from "axios";

export interface GoogleData {
  email: string | undefined | null;
  name: string | undefined | null;
  picture: string | undefined | null;
}
export default function GoogleLogin() {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    const login = async () => {
      if (status === "authenticated") {
        const user = session?.user;
        try {
          const response = await google_login({
            email: user?.email,
            name: user?.name,
            picture: user?.image,
          });

          if (response.success) {
            const { user, refreshToken, accessToken } = response;
            Cookies.set("refreshToken", refreshToken);
            Cookies.set("accessToken", accessToken);
            dispatch(addUser(user));
            toast.success(response.message);
            router.push("/");
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response && error.response.data.redirect) {
              toast.error(error.response.data.message);
              router.push("/login");
            }
          } else {
            toast.error("Login failed");
          }
        }
      } else if (status === "unauthenticated") {
        router.push("/login");
      }
    };

    login();
  }, [status, session, router, dispatch]); // Dependencies: re-run effect when status or session changes

  return <div>Logging in...</div>; // You can customize this or add a loading indicator
}
