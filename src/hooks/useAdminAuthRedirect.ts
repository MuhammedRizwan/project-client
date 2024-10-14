import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Cookies from "js-cookie"


const useAdminAuthRedirect=()=>{
    const router = useRouter();
    const accessToken = Cookies.get("adminToken");
  
    useEffect(() => {
      if (accessToken) {
        router.push("/admin/dashboard");
      }
    }, [accessToken, router]);
  };

export default useAdminAuthRedirect;