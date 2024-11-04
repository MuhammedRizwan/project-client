import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useAgent() {
    const router = useRouter();
    const token = Cookies.get("agentToken");
    useEffect(() => {
        if (token) {
            router.replace("/agent/Dashboard");
        }
    },[token,router])
}