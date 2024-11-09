// "use client";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";

// export default function ProtectedRouter({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const userToken = Cookies.get("accessToken");
//   const adminToken = Cookies.get("adminToken");
//   if (adminToken || userToken) {
//     return router.back();
//   } else {
//     <>{children}</>;
//   }
// }
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
  const userToken = Cookies.get("accessToken");
  const adminToken = Cookies.get("adminToken");

  useEffect(() => {
    if (userToken || adminToken) {
      router.back();
    }
    setLoading(false)
  }, [router, userToken, adminToken]);

  if (loading) {
    return <div><Spinnerpage/></div>; 
  }
  return !(userToken || adminToken) ? <>{children}</> : null;
}

