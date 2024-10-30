'use client'
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function useUserLoggedIn () {
    const router = useRouter();
    const token = Cookies.get("accessToken");
    useEffect(() => {
        if (!token) {
            toast.error("Please login first");
            router.push("/login");
        }
    }, [token, router]);
}