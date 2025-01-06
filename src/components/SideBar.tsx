'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BookOpen, Home, LogOut, LucideIcon, Package, User, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";


export interface MenuItem {
    href: string;
    label: string;
    icon:LucideIcon;
  }
  
  interface SidebarProps {
    name?: string;
    onLogout: () => void;
  }
export default function Sidebar({ name,onLogout }:SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="sticky h-full bg-white shadow-xl w-64 ms-2 mb-20 rounded-xl">
    <div className="p-6">
      <h1 className="text-xl font-bold">{name}</h1>
    </div>
    <nav className="mt-4">
      <ul className="space-y-4">
        {
          [
            { href: "/agent/Dashboard", label: "Dashboard", icon:<Home className="w-6 h-6 mr-3" />},
            { href: "/agent/profile", label: "Profile", icon:<User className="w-6 h-6 mr-3"/> },
            { href: "/agent/travel-packages", label: "Travel Packages", icon:<Package className="w-6 h-6 mr-3"/> },
            { href: "/agent/offers", label: "Offers", icon:<BookOpen className="w-6 h-6 mr-3"/>},
            { href: "/agent/wallet", label: "Wallet", icon:<Wallet className="w-6 h-6 mr-3"/> },
            { href: "/agent/notifications", label: "Notifications", icon:<Bell className="w-6 h-6 mr-3"/> },
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
      <div className="p-4 bg-white border-t border-gray-200">
        <button
          onClick={() => {
            if (onLogout) onLogout();
            router.push('/agent');
          }}
          className="flex items-center w-full bg-white shadow-md rounded-lg px-6 py-3 cursor-pointer hover:bg-gray-100 transition-all duration-150"
        >
          <LogOut className="w-6 h-6 mr-3" />
          <span className="text-gray-700">Logout</span>
        </button>
      </div>
    </aside>
  );
}

