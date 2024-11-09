import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function useUser() {
  const router = useRouter();
  const token = Cookies.get("accessToken");
  if (token) {
    router.replace("/");
  }
}
