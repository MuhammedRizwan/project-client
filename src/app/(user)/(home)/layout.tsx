'use client'
import { useSocket } from "@/components/context/socketContext";
import Notifications from "@/components/notification/notification";
import UserWrapper from "@/components/wrapper/userwrapper";
import INotification from "@/interfaces/notification";
import { useEffect, useState } from "react";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { socket } = useSocket();
  const [notificationsData, setNotificationsData] =
    useState<INotification | null>(null);
  useEffect(() => {
    if(!socket)return
    socket.on("show-notification", (notification) => {
      setNotificationsData(notification);
    });
  }, [socket]);
  return (
    <>
      <UserWrapper>
        {notificationsData && (
          <Notifications notificationsData={notificationsData} />
        )}
        {children}
      </UserWrapper>
    </>
  );
}
