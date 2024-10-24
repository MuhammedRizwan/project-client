import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Cookies from "js-cookie"


const useAgentAuthRedirect=()=>{
    const router = useRouter();
    const accessToken = Cookies.get("agentToken");
    useEffect(() => {
      if (accessToken) {
        router.push("/agent/Dashboard");
      }
    }, [accessToken, router]);
  };

export default useAgentAuthRedirect;