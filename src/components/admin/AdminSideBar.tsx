"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Building2, List, Calendar, Gift, Bell, Wallet } from "lucide-react";

export default function AdminSidebar({ Name = "HEAVEN FINDER" }) {
  const pathname = usePathname();

  return (
    <aside className="h-screen bg-white shadow-xl w-64 ms-2 mb-20 mt-3 rounded-xl">
      <div className="p-6">
        <h1 className="text-3xl font-bold">{Name}</h1>
      </div>
      <nav className="mt-4">
        <ul className="space-y-4">
          {[
            { href: "/admin/dashboard", label: "Dashboard", icon: <Home className="w-6 h-6 mr-3" /> },
            { href: "/admin/user", label: "Users", icon: <User className="w-6 h-6 mr-3" /> },
            { href: "/admin/travel-agencies", label: "Travel Agencies", icon: <Building2 className="w-6 h-6  mr-3" /> },
            { href: "/admin/category", label: "Category", icon: <List className="w-6 h-6  mr-3" /> },
            { href: "/admin/bookings", label: "Bookings", icon: <Calendar className="w-6 h-6  mr-3" /> },
            { href: "/admin/coupons", label: "Coupon", icon: <Gift className="w-6 h-6  mr-3" /> },
            { href: "/admin/wallet", label: "Wallet", icon: <Wallet className="w-6 h-6  mr-3" /> },
            { href: "/admin/notifications", label: "Notifications", icon: <Bell className="w-6 h-6  mr-3" /> },
          ].map((item) => (
            <li
              key={item.href}
              className={`flex items-center ${
                pathname === item.href ? "bg-slate-100 shadow-inner" : "hover:bg-white"
              } transition-all duration-200 shadow-lg rounded-lg px-6 py-2 cursor-pointer`}
            >
              <Link href={item.href} className="flex items-center w-full">
                {item.icon}
                <span className="text-gray-800 font-semibold">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
