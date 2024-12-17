"use client";
import { useSocket } from "@/components/context/socketContext";
import NotificationList from "@/components/notification/notificationList";
import { fetch_user_notification } from "@/config/user/authservice";

import INotification from "@/interfaces/notification";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Notification() {
    const {socket}=useSocket()
  const user = useSelector((state: RootState) => state.user.user);
  const [notification, setNotification] = useState<INotification[] >(
    []
  );
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch_user_notification(user?._id);
      if (response.success) {
        setNotification(response.notifications);
      }
    };
    fetchData();
  }, [user?._id]);

  useEffect(() => {
    if (!socket) return;
  
    socket.on("show-notification", (notification) => {
      setNotification((prevNotifications) => [...prevNotifications, notification]);
    });
  
    // Cleanup function to avoid memory leaks
    return () => {
      socket.off("show-notification");
    };
  }, [socket]);
  return (
    <>{notification && <NotificationList notification={notification} />}</>
  );
}
