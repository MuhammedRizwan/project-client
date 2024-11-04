import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useAdmin() {
    const router = useRouter();
    const token = Cookies.get("adminToken");
    useEffect(() => {
        if (token) {
            router.replace("/admin/dashboard");
        }
    },[token,router])
}