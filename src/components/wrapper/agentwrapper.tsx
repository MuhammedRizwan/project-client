'use client';
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect } from "react";

export default function AgentWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = Cookies.get("agentToken");
  useEffect(() => {
      if (!token) {
          router.push("/agent");
      }
  }, [token, router]);

  return <>{children}</>; 
}