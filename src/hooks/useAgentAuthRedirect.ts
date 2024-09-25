import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { RootState} from "@/store/store";
import { useSelector } from "react-redux";


const useAgentAuthRedirect=()=>{
    const router = useRouter();
    const accessToken = useSelector((state: RootState) => state.agent.accessToken);
  
    useEffect(() => {
      if (accessToken) {
        router.replace("/agent/Dashboard");
      }
    }, [accessToken, router]);
  };

export default useAgentAuthRedirect;