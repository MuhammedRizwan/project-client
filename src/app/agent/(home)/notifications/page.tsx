"use client";
import { useSocket } from "@/components/context/socketContext";
import NotificationList from "@/components/notification/notificationList";
import { fetch_agent_notification } from "@/config/agent/authservice";
import INotification from "@/interfaces/notification";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Notification() {
  const { socket } = useSocket();
  const agent = useSelector((state: RootState) => state.agent.agent);
  const [notification, setNotification] = useState<INotification[] >([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch_agent_notification(agent?._id);
      if (response.success) {
        setNotification(response.notifications);
      }
    };
    fetchData();
  }, [agent?._id]);

  useEffect(() => {
    if (!socket) return;
    socket.on("show-notification", (notification) => {
      setNotification((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
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
