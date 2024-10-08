"use client";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import Logo from "../Logo";
import { SearchIcon } from "../icons/SearchIcon";
import { BsThreeDotsVertical } from "react-icons/bs";
import { PiPersonArmsSpreadFill } from "react-icons/pi";
import { FaHome } from "react-icons/fa";
import { LuPackageSearch } from "react-icons/lu";
import { GiPostStamp } from "react-icons/gi";
import { TiContacts } from "react-icons/ti";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/reducer/userReducer";

export default function Header() {
  const { accessToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className=" bg-gray-100">
      <Navbar
        shouldHideOnScroll
        maxWidth={"full"}
        className=" bg-yellow-600 rounded-b-3xl "
      >
        <NavbarBrand>
          <Logo />
          <p className="font-bold text-inherit">HEAVEN FINDER</p>
        </NavbarBrand>
        <NavbarContent
          className="hidden lg:flex gap-4 relative"
          justify="center"
        >
          <NavbarItem className="relative">
            <Link
              href="#"
              className="text-blck hover:font-bold inline-block w-10"
            >
              HOME
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-blck hover:font-bold inline-block w-20"
              href="#"
            >
              PACKAGES
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-blck text-center hover:font-bold inline-block w-10"
              href="#"
            >
              BLOG
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-blck hover:font-bold inline-block w-10"
              href="#"
            >
              CONTACT
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[10rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-black bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Type to search..."
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
          />
          <NavbarItem>
            {accessToken ? (
              <Button
                onClick={() => {
                  dispatch(logout());
                  router.replace("/login");
                }}
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
                // href={pathname === "/login" ? "/signup" : "/login"}
                variant="flat"
              >
                {pathname === "/login" ? "Sign up" : "Sign in"}
              </Button>
            )}
          </NavbarItem>
        </NavbarContent>

        <Dropdown showArrow placement="bottom-end" className="relative right-0">
          <DropdownTrigger>
            <div>
              <BsThreeDotsVertical />
            </div>
          </DropdownTrigger>
          <DropdownMenu
            variant="faded"
            aria-label="Dropdown menu with description"
          >
            <DropdownItem
              key="agencyLogin"
              description="Login as travel agency"
              className=" text-red-600 font-thin"
              startContent={<PiPersonArmsSpreadFill />}
            >
              <Link href="/agent">Login as agent</Link>
            </DropdownItem>
            <DropdownItem
              key="Home"
              description="visit Home page"
              className="lg:hidden sm:block text-danger font-thin"
              startContent={<FaHome />}
            >
              Home
            </DropdownItem>
            <DropdownItem
              key="Packages"
              description="filter the packages"
              className="lg:hidden sm:block text-danger font-thin"
              startContent={<LuPackageSearch />}
            >
              Packages
            </DropdownItem>

            <DropdownItem
              key="Blog"
              description="Read the blogs"
              className="lg:hidden sm:block text-danger font-thin"
              startContent={<GiPostStamp />}
            >
              Blog
            </DropdownItem>
            <DropdownItem
              key="Contact"
              description="for any Queries"
              className="lg:hidden sm:block text-danger font-thin"
              startContent={<TiContacts />}
            >
              Contact
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Navbar>
    </div>
  );
}
