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
  const token = Cookies.get("accessToken");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.back();
    }
    setLoading(false);
  }, [token, router]);
  return <>{loading ? <Spinner label="Loading..." color="danger" />: children}</>;
}
