"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Spinnerpage from "@/app/loading";

export default function ProtectedRouter({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading,setLoading]=useState(true)
  const agentToken = Cookies.get("agentToken");
  const adminToken = Cookies.get("adminToken");

  useEffect(() => {
    setLoading(true)
    if (agentToken || adminToken) {
      router.back();
    }
    setLoading(false)
  }, [router, agentToken, adminToken]);

  if (loading) {
    return <div><Spinnerpage/></div>; 
  }
  return !(agentToken || adminToken) ? <>{children}</> : null;
}

