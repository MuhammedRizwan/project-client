import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import Logo from "../Logo";


export default function AgentNavbar() {
  return (
    <Navbar shouldHideOnScroll maxWidth={'full'}>
      <NavbarBrand>
        <Logo/>
        <p className="font-bold text-inherit">HEAVEN FINDER</p>
      </NavbarBrand>
      
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
