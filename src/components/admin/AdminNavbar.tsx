"use client";
import React, { useEffect, useState, useCallback } from "react";
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

 
  const checkAuth = useCallback(() => {
    const token = Cookies.get("adminToken");
    setIsLoggedIn(!!token); 
  }, []);


  useEffect(() => {
    checkAuth(); 
  }, [checkAuth,router,dispatch]);

  const handleLogout = () => {
    Cookies.remove("adminToken"); 
    dispatch(logout());
    setIsLoggedIn(false); 
    router.replace("/admin"); 
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
