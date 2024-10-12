'use client'
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, LayoutDashboard, Package, BookOpen, Tag, Bell } from "lucide-react"
import Cookies from "js-cookie"
import { useDispatch } from "react-redux"
import { logout } from "@/store/reducer/agentReducer"


export default function AgentSidebar({ name = "HEAVEN FINDER" }) {
  const pathname = usePathname()
const dispatch=useDispatch()
const router = useRouter();
  const menuItems = [
    { href: "/agent/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/agent/travel-packages", label: "Travel Packages", icon: Package },
    { href: "/agent/bookings", label: "Bookings", icon: BookOpen },
    { href: "/admin/bookings", label: "Coupons", icon: Tag },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
  ]

  return (
    <aside className=" h-screen bg-white shadow-lg w-64 ms-5 mb-20 mt-8 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">{name}</h1>
      </div>
      <nav className="mt-2 flex-1 overflow-y-auto">
        <ul className="space-y-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li
                key={item.href}
                className={`flex items-center ${
                  isActive ? "bg-gray-100" : "bg-white"
                } shadow-lg rounded-lg px-6 py-4 cursor-pointer`}
              >
                <Link href={item.href} className="flex items-center w-full">
                  <item.icon className="w-6 h-6 text-yellow-500 mr-3" />
                  <span className="text-gray-700">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="bottom-0 p-4 bg-white border-t border-gray-200">
        <button
          onClick={() => {
            Cookies.remove('accessToken');
            dispatch(logout())
            router.push('/agent');
          }}
          className="flex items-center w-full bg-white shadow-lg rounded-lg px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
        >
          <LogOut className="w-6 h-6 text-yellow-500 mr-3" />
          <span className="text-gray-700">Logout</span>
        </button>
      </div>
    </aside>
  )
}