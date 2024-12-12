'use client'

import { useDispatch } from "react-redux";
import { logout } from "@/store/reducer/agentReducer";
import Sidebar from "../SideBar";

export default function AgentDashboard() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Sidebar
      name="HEAVEN FINDER"
      onLogout={handleLogout}
    />
  );
}


