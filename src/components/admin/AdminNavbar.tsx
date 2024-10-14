"use client";
import React from "react";
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
  const router=useRouter()
  const dispatch=useDispatch()
  const accessToken=Cookies.get("adminToken")
  return (
    <Navbar shouldHideOnScroll maxWidth={"full"}>
      <NavbarBrand>
        <Logo />
        <p className="font-bold text-inherit">HEAVEN FINDER</p>
      </NavbarBrand>
      <NavbarContent justify="end">
      <NavbarItem>
          {accessToken?( <Button 
          onClick={()=>{
            Cookies.remove('adminToken');
            dispatch(logout())
            router.push('/admin');
          }}
           color="primary"  variant="flat">
            Logout
          </Button>):( <Button 
          onClick={()=>{
            router.push('/admin');
          }}
           color="primary"  variant="flat">
            {"Login"}
          </Button>)}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
