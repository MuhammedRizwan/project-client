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
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { logout } from "@/store/reducer/adminReducer";

export default function AdminNavbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = Cookies.get("adminToken");
  useEffect(() => {
    if (!token) {
      router.push("/admin");
    }
  },[token,router])
  const handleLogout = () => {
    Cookies.remove("adminToken");
    dispatch(logout());
    router.push("/admin");
  };

  return (
    <Navbar shouldHideOnScroll maxWidth="full">
      <NavbarBrand>
        <Logo />
        <p className="font-bold text-inherit">HEAVEN FINDER</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          {token && (
            <Button onClick={handleLogout} color="primary" variant="flat">
              Logout
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
