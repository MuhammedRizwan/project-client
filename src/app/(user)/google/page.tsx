"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GoogleLogin() {
  const { data: session, status } = useSession(); 

  const router = useRouter();
  
  useEffect(() => {
    const login = async () => {
      if (status === "authenticated") {
        const user = session?.user;
        try {
          const response = await axios.post("http://localhost:5000/googleLogin", {
            email: user?.email,
            name: user?.name,
            picture: user?.image,
            expiresIn: session?.expires,
          });

          console.log("Response from backend:", response.data);
          router.push("/"); // Redirect on successful login
        } catch (error) {
          console.error("Error during login:", error);
          router.push("/login"); // Redirect to login on error
        }
      } else if (status === "unauthenticated") {
        router.push("/login"); // Redirect if not authenticated
      }
    };

    login();
  }, [status, session, router]); // Dependencies: re-run effect when status or session changes

  return <div>Logging in...</div>; // You can customize this or add a loading indicator
}
