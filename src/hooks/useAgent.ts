import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function useAgent() {
  const router = useRouter();
  const token = Cookies.get("agentToken");
  if (token) {
    router.replace("/agent/Dashboard");
  }
}
