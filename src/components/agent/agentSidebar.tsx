'use client'
import { LayoutDashboard, Package, BookOpen, Bell, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/store/reducer/agentReducer";
import Sidebar, { MenuItem } from "../SideBar";

export default function AgentDashboard() {
  const dispatch = useDispatch();
  const menuItems:MenuItem[] = [
    { href: "/agent/Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/agent/profile", label: "Profile", icon: User },
    { href: "/agent/travel-packages", label: "Travel Packages", icon: Package },
    { href: "/agent/offer", label: "Offers", icon: BookOpen },
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
