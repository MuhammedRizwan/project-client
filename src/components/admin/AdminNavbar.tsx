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
// import Link from "next/link";

export default function AdminNavbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = Cookies.get("adminToken");
  useEffect(() => {
    if (!token) {
      router.push("/admin");
    }
  }, [token, router]);
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
        {/* <NavbarItem>
          <div>
            <Link href="/admin/dashboard">Dashboard</Link>
            <Link href="/admin/user">Users</Link>
            <Link href="/admin/travel-agencies">Travel Agencies</Link>
            <Link href="/admin/category">Category</Link>
            <Link href="/admin/bookings">Bookings</Link>
            <Link href="/admin/coupons">Coupon</Link>
          </div>
        </NavbarItem> */}
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
