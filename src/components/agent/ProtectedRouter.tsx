"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Spinner } from "@nextui-org/react";

export default function ProtectedRouter({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const userToken = Cookies.get("accessToken");
  const adminToken = Cookies.get("adminToken");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userToken || adminToken) {
      router.back();
    }
    setLoading(false);
  }, [ router, userToken, adminToken]);
  return (
    <>{loading ? <Spinner label="Loading..." color="danger" /> : children}</>
  );
}
