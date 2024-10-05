import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { RootState} from "@/store/store";
import { useSelector } from "react-redux";


const useAdminAuthRedirect=()=>{
    const router = useRouter();
    const accessToken = useSelector((state: RootState) => state.admin.accessToken);
  
    useEffect(() => {
      if (accessToken) {
        router.replace("/admin/dashboard");
      }
    }, [accessToken, router]);
  };

export default useAdminAuthRedirect;