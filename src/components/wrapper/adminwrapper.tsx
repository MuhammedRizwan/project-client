'use client';
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect } from "react";

export default function AdminWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = Cookies.get("adminToken");
  useEffect(() => {
      if (!token) {
          router.push("/admin");
      }
  }, [token, router]);

  return <>{children}</>; 
}