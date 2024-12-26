"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  Building2,
  List,
  Calendar,
  Gift,
  Bell,
  Menu,
  X,
} from "lucide-react";

export default function AdminSidebar({ Name = "HEAVEN FINDER" }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-3 right-32 z-50 p-2 rounded-lg bg-white shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={toggleMobileMenu}
        />
      )}

      <aside
        className={`fixed lg:static h-[calc(100vh-64px)] bg-white shadow-xl w-64 z-40 transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "left-0" : "-left-64"} 
          lg:left-0 lg:ms-2 rounded-xl my-2`}
        style={{
          top:"12%",
          position: "sticky",
        }}
      >
        <div className="p-6">
          <h1 className="text-3xl font-bold">{Name}</h1>
        </div>
        <nav className="mt-4">
          <ul className="space-y-4">
            {[
              {
                href: "/admin/dashboard",
                label: "Dashboard",
                icon: <Home className="w-6 h-6 mr-3" />,
              },
              {
                href: "/admin/user",
                label: "Users",
                icon: <User className="w-6 h-6 mr-3" />,
              },
              {
                href: "/admin/travel-agencies",
                label: "Travel Agencies",
                icon: <Building2 className="w-6 h-6  mr-3" />,
              },
              {
                href: "/admin/category",
                label: "Category",
                icon: <List className="w-6 h-6  mr-3" />,
              },
              {
                href: "/admin/bookings",
                label: "Bookings",
                icon: <Calendar className="w-6 h-6  mr-3" />,
              },
              {
                href: "/admin/coupons",
                label: "Coupon",
                icon: <Gift className="w-6 h-6  mr-3" />,
              },
              {
                href: "/admin/notifications",
                label: "Notifications",
                icon: <Bell className="w-6 h-6  mr-3" />,
              },
            ].map((item) => (
              <li
                key={item.href}
                className={`flex items-center ${
                  pathname === item.href
                    ? "bg-slate-100 shadow-inner"
                    : "hover:bg-white"
                } transition-all duration-200 shadow-lg rounded-lg px-6 py-2 cursor-pointer`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href={item.href} className="flex items-center w-full">
                  {item.icon}
                  <span className="text-gray-800 font-semibold">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
