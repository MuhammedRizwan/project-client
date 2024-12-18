"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { signOut as nextAuthSignOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/reducer/userReducer";
import Cookies from "js-cookie";
import { RootState } from "@/store/store";

export default function UserLoginButton() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const pathname = usePathname();
  const accessToken = Cookies.get("accessToken");
  const dispatch = useDispatch();
  const handleLogout = async () => {
    dispatch(logout());
    if (user?.google_authenticated) {
      await nextAuthSignOut({ callbackUrl: "/login" });
    } else {
      router.push("/login");
    }
  };
  return (
    <>
      {accessToken || user ? (
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
           {user?.profile_picture && typeof user?.profile_picture === "string" ?(
              <User
              as="button"
              avatarProps={{
                isBordered: true,
                src:  user?.profile_picture ,
              }}
              className="transition-transform"
              description={user?.email || ""}
              name={user?.username || ""}
            />
           ):(
            <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: "" ,
            }}
            className="transition-transform"
            description={user?.email || ""}
            name={user?.username || ""}
          />
           )}
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="profile" color="warning" onClick={()=>router.push("/profile-edit")}>profile</DropdownItem>
            <DropdownItem key="travel history" color="warning" onClick={()=>router.push("/travel-history")}>travel history</DropdownItem>
            <DropdownItem key="bookings" color="warning" onClick={()=>router.push("/booked")}>my bookings</DropdownItem>
            <DropdownItem key="system">notification</DropdownItem>
            <DropdownItem key="Chats" color="warning" onClick={()=>router.push("/chat")}>friends</DropdownItem>
            <DropdownItem key="my posts" color="warning" onClick={()=>router.push("/user-post")}>my posts</DropdownItem>
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
