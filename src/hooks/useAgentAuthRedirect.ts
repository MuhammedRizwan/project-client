import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Cookies from "js-cookie"


const useAgentAuthRedirect=()=>{
    const router = useRouter();
    const accessToken = Cookies.get("accessToken");
  
    useEffect(() => {
      if (accessToken) {
        router.replace("/agent/Dashboard");
      }
    }, [accessToken, router]);
  };

export default useAgentAuthRedirect;