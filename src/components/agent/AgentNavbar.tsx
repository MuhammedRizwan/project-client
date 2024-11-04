"use client";
import React, { useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import Logo from "../Logo";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/reducer/agentReducer";
import Cookies from "js-cookie";
import { RootState } from "@/store/store";

export default function AgentNavbar() {
  const router = useRouter();
  const agent = useSelector((state: RootState) => state.agent);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const accessToken = Cookies.get("agentToken");
  useEffect(() => {
    if (!accessToken || !agent) {
      router.push("/agent");
    }
  }, [router, accessToken, agent]);
  return (
    <Navbar maxWidth={"full"}>
      <NavbarBrand>
        <Logo />
        <p className="font-bold text-inherit">HEAVEN FINDER</p>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          {accessToken ? (
            <Button
              onClick={() => {
                dispatch(logout());
                router.push("/agent");
              }}
              color="primary"
              variant="flat"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => {
                router.push(pathname === "/agent" ? "agent/signup" : "/agent");
              }}
              color="primary"
              variant="flat"
            >
              {pathname === "/agent" ? "Signup" : "Login"}
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
