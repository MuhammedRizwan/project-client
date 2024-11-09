"use client";
import { google_login } from "@/api/user/authservice";
import useUser from "@/hooks/useUser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface GoogleData {
  email: string | undefined | null;
  name: string | undefined | null;
  picture: string | undefined | null;
  expiresIn: string;
}

export default function GoogleLogin() {
  useUser();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const login = async () => {
      if (status === "authenticated" && session?.user && !isProcessing) {
        setIsProcessing(true);
        try {
          const response = await google_login({
            email: session.user.email,
            name: session.user.name,
            picture: session.user.image,
            expiresIn: session.expires,
          });

          if (response.success) {
            router.push("/");
          } else {
            throw new Error("Login failed");
          }
        } catch (error) {
          console.error("Error during login:", error);
          router.push("/login");
        } finally {
          setIsProcessing(false);
        }
      } else if (status === "unauthenticated") {
        router.push("/login");
      }
    };

    if (status === "authenticated" && !isProcessing) {
      login();
    }
  }, [isProcessing, router, status]);

  return <div>Logging in...</div>;
}
