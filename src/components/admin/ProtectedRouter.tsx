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
  const [loading, setLoading] = useState(true); 
  const agentToken = Cookies.get("agentToken");
  const userToken = Cookies.get("accessToken");

  useEffect(() => {
  
    if (agentToken || userToken) {
      router.back();
    }
    setLoading(false);
  }, [router, agentToken, userToken]);

  if (loading) {
    return <div><Spinnerpage/></div>; 
  }
  return !(agentToken || userToken) ? <>{children}</> : null;
}


