'use client'
import { useSocket } from "@/components/context/socketContext";
import NotificationList from "@/components/notification/notificationList";
import { fetch_admin_notification } from "@/config/admin/authservice";
import INotification from "@/interfaces/notification";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Notification() {
  const {socket}=useSocket()
  const admin=useSelector((state:RootState)=>state.admin.admin)
  const [notification,setNotification]=useState<INotification[]>([])
  useEffect(()=>{
    const fetchData = async () => {
      const response=await fetch_admin_notification(admin?._id)
      if(response.success){
        setNotification(response.notifications)
      }
    }
    fetchData()
  },[admin?._id])

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
  return <NotificationList notification={notification} />;
}
