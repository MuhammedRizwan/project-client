import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function useAdmin() {
  const router = useRouter();
  const token = Cookies.get("adminToken");
  if (token) {
    router.replace("/admin/dashboard");
  }
}
