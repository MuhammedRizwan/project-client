'use client'
import { LayoutDashboard, Package, BookOpen, Tag, Bell } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/store/reducer/agentReducer";
import Sidebar, { MenuItem } from "../SideBar";

export default function AgentDashboard() {
  const dispatch = useDispatch();
  const menuItems:MenuItem[] = [
    { href: "/agent/Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/agent/travel-packages", label: "Travel Packages", icon: Package },
    { href: "/agent/bookings", label: "Bookings", icon: BookOpen },
    { href: "/agent/coupons", label: "Coupons", icon: Tag },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Sidebar
      name="HEAVEN FINDER"
      menuItems={menuItems}
      onLogout={handleLogout}
    />
  );
}
