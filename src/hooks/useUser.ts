import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useUser() {
    const router = useRouter();
    const token = Cookies.get("accessToken");
    useEffect(() => {
        if (token) {
            router.replace("/");
        }
    },[token,router])
}