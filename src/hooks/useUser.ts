import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Cookies from "js-cookie"


const useUser=()=>{
    const router = useRouter();
    const accessToken = Cookies.get("accessToken");
    useEffect(() => {
      if (accessToken) {
        router.back();
      }
    }, [accessToken, router]);
  };

export default useUser;