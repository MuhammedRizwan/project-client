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
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("adminToken");
  useEffect(() => {
    if (!token) {
      router.back();
    }
    setLoading(false);
  }, [router, token]);
  return <>{loading ? <Spinner label="Loading..." color="danger" />: children}</>;
}
