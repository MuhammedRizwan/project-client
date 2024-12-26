"use client";
import ProtectedRouter from "@/components/admin/ProtectedRouter";
import AdminSidebar from "@/components/admin/AdminSideBar";
import Notifications from "@/components/notification/notification";
import INotification from "@/interfaces/notification";
import { useEffect, useState } from "react";
import { useSocket } from "@/components/context/socketContext";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { socket } = useSocket();
  const [notificationsData, setNotificationsData] =
    useState<INotification | null>(null);
  useEffect(() => {
    if (!socket) return;
    socket.on("show-notification", (notification) => {
      setNotificationsData(notification);
    });
    return () => {
      socket.off("show-notification");
    };
  }, [socket]);
  return (
    <ProtectedRouter>
      {notificationsData && (
        <Notifications notificationsData={notificationsData} />
      )}
      
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar Name="DASHBOARD" />
        <div className="flex-1 p-2">{children}</div>
      </div>
    </ProtectedRouter>
  );
}
