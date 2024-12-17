import INotification from "@/interfaces/notification";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const Notifications = ({ notificationsData }: { notificationsData: INotification }) => {
  const requestNotificationPermission = async () => {
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  const showBrowserNotification = (notification: INotification) => {
    if (Notification.permission === "granted") {
      new Notification(notification.message, {
        body: notification.url
          ? `Click to open: ${notification.url}`
          : "You have a new notification!",
        icon: "https://via.placeholder.com/128",
      });
    }
  };

  const showToastNotification = (notification: INotification) => {
    toast(
      (t) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ fontWeight: "bold", margin: 0 }}>{notification.message}</p>
          {notification.url && (
            <a
              href={notification.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
              onClick={() => toast.dismiss(t.id)}
            >
              {notification.url}
            </a>
          )}
        </div>
      ),
      {
        icon: "🔔",
        duration: 5000,
      }
    );
  };

  useEffect(() => {
    requestNotificationPermission();

    if (notificationsData && !notificationsData.isRead) {
      showBrowserNotification(notificationsData);
      showToastNotification(notificationsData);
    }
  }, [notificationsData]);

  return null;
};

export default Notifications;
