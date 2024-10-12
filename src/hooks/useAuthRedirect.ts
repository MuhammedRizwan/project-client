import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken"); // Access token from cookies
    console.log(accessToken);

    if (accessToken) {
      router.replace("/");
    }
  }, [router]);
};

export default useAuthRedirect;
