"use client";
import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {Spinner} from "@nextui-org/react";

export default function ProtectedRouter({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const agentToken = Cookies.get("agentToken");
  const adminToken = Cookies.get("adminToken");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (agentToken || adminToken) {
      router.back();
    }
    setLoading(false);
  }, [agentToken, adminToken, router]);
  return <>{loading ? <Spinner label="Loading..." color="danger" />: children}</>;
}
