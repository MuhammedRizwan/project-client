import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { RootState} from "@/store/store";
import { useSelector } from "react-redux";


const useAuthRedirect=()=>{
    const router = useRouter();
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
  
    useEffect(() => {
      if (accessToken) {
  
        router.replace("/");
      }
    }, [accessToken, router]);
  };

export default useAuthRedirect;