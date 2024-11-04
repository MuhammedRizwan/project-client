'use client';
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect } from "react";

export default function UserWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = Cookies.get("accessToken");
  useEffect(() => {
      if (!token) {
          router.push("/login");
      }
  }, [token, router]);

  return <>{children}</>; 
}