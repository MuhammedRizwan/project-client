"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function usePublicProtect() {
  const router = useRouter();
  useEffect(() => {
    const agentToken = Cookies.get("agentToken");
    const adminToken = Cookies.get("adminToken");

    if (agentToken) {
      return router.replace("/agent/Dashboard");
    } else if (adminToken) {
      return router.replace("/admin/dashboard");
    }
  }, [router]);
}
