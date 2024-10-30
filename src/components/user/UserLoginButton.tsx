"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/reducer/userReducer";
import Cookies from "js-cookie";
import { RootState } from "@/store/store";

export default function UserLoginButton() {
  const router = useRouter();
  const userData = useSelector((state: RootState) => state.user.user);
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const accessToken = Cookies.get("accessToken");
  const dispatch = useDispatch();
  const handleLogout = () => {
    if (user) {
      nextAuthSignOut({
        callbackUrl: "/login",
      });
    } else if (accessToken) {
      dispatch(logout());
      router.push("/login");
    }
  };
  return (
    <>
      {accessToken || user ? (
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                src: userData?.profile_picture || "https://images.unsplash.com/broken",
              }}
              className="transition-transform"
              description={userData?.email || ""}
              name={userData?.username || ""}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="profile" color="warning" onClick={()=>router.push("/profile-edit")}>profile</DropdownItem>
            <DropdownItem key="travel history" color="warning" onClick={()=>router.push("/travel-history")}>travel history</DropdownItem>
            <DropdownItem key="bookings" color="warning" onClick={()=>router.push("/booked")}>my bookings</DropdownItem>
            <DropdownItem key="system">notification</DropdownItem>
            <DropdownItem key="configurations">friends</DropdownItem>
            <DropdownItem key="help_and_feedback">my posts</DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
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
  );
}
