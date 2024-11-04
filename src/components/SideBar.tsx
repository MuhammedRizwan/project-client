'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";


export interface MenuItem {
    href: string;
    label: string;
    icon:LucideIcon;
  }
  
  interface SidebarProps {
    name?: string;
    menuItems: MenuItem[];
    onLogout: () => void;
  }
export default function Sidebar({ name, menuItems, onLogout }:SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="sticky top-16 max-h-screen bg-white shadow-lg w-52 ms-3 mb-3 mt-3 flex flex-col rounded-lg overflow-hidden">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800">{name}</h1>
      </div>
      <nav className="mt-2 flex-1 overflow-y-auto">
        <ul className="space-y-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li
                key={item.href}
                className={`flex items-center ${
                  isActive ? "bg-gray-100" : "hover:bg-gray-50"
                } shadow-md rounded-lg px-6 py-3 cursor-pointer transition-all duration-150`}
              >
                <Link href={item.href} className="flex items-center w-full">
                  <item.icon className="w-6 h-6 text-yellow-500 mr-3" />
                  <span className="text-gray-700 text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
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
          <LogOut className="w-6 h-6 text-yellow-500 mr-3" />
          <span className="text-gray-700">Logout</span>
        </button>
      </div>
    </aside>
  );
}
