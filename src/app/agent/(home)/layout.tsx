"use client";
import Agentsidebar from "@/components/agent/agentSidebar";
import { useSocket } from "@/components/context/socketContext";
import Notifications from "@/components/notification/notification";
import AgentWrapper from "@/components/wrapper/agentwrapper";
import INotification from "@/interfaces/notification";
import { useEffect, useState } from "react";

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
    <AgentWrapper>
      {notificationsData && (
        <Notifications notificationsData={notificationsData} />
      )}
      <div className="flex bg-gray-100">
        <Agentsidebar />
        <div className="fleX p-3 w-full">{children}</div>
      </div>
    </AgentWrapper>
  );
}
