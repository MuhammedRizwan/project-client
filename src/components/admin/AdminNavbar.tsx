"use client";
import React, { useEffect, useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import Logo from "../Logo";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { logout } from "@/store/reducer/adminReducer";

export default function AdminNavbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for admin token and handle unauthorized access
 
  useEffect(() => {
    const handleAuth = () => {
      const token = Cookies.get("adminToken");
      if (token) {
        setIsLoggedIn(true);
      } else {
        dispatch(logout());
        router.push("/admin");
      }
    };
  
    handleAuth();
  }, [dispatch, router]);

  const handleLogout = () => {
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
          {isLoggedIn ? (
            <Button onClick={handleLogout} color="primary" variant="flat">
              Logout
            </Button>
          ) : (
            <Button onClick={() => router.push("/admin")} color="primary" variant="flat">
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
