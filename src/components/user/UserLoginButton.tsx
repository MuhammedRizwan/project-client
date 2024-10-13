'use client'
import { Button } from "@nextui-org/react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/store/reducer/userReducer";
import Cookies from "js-cookie";

export default function UserLoginButton() {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession(); 
  const user = session?.user;
  const accessToken =Cookies.get("accessToken");
  const dispatch = useDispatch();
    const handleLogout = () => {
        if (user) {
          nextAuthSignOut({
            callbackUrl: "/login",
          });
        } else if (accessToken) {

          dispatch(logout());
          router.replace("/login"); 
        }
      };
    return (
        <>
        {accessToken || user ? (
            <Button
            onClick={handleLogout}
            className=" bg-yellow-700 text-black"
            variant="flat"
            >
              Logout
            </Button>
          ) : (
              <Button
              onClick={() => {
                  router.push(pathname === "/login" ? "/signup" : "/login");
                }}
                className=" bg-yellow-700 text-black"
                variant="flat"
                >
              {pathname === "/login" ? "Sign up" : "Sign in"}
            </Button>
          )}
          </>
    )
}