"use client";
import { Card, CardBody, Avatar, Button } from "@nextui-org/react";
import INotification from "@/interfaces/notification";
import { useRouter } from "next/navigation";

// // Mock data for notifications
// const notifications = [
//   {
//     id: 1,
//     title: "New message from John Doe",
//     content: "Hey, how's it going? I wanted to check in on the project status.",
//     time: "2 hours ago",
//     avatar: "https://i.pravatar.cc/150?u=johndoe",
//     read: false,
//   },
//   {
//     id: 2,
//     title: "Meeting reminder",
//     content: "Don't forget about the team meeting at 3 PM today.",
//     time: "5 hours ago",
//     avatar: "https://i.pravatar.cc/150?u=meeting",
//     read: false,
//   },
//   {
//     id: 3,
//     title: "New comment on your post",
//     content: "Alice left a comment on your recent blog post.",
//     time: "1 day ago",
//     avatar: "https://i.pravatar.cc/150?u=alice",
//     read: true,
//   },
// ];

export default function NotificationList({
  notification,
}: {
  notification: INotification[] | null;
}) {
  console.log(notification, "notification");
    const router=useRouter()
  return (
    <Card className="max-w-full mx-auto">
      <CardBody className="p-4">
        <h2 className="text-2xl font-bold mb-4">Notifications</h2>
        <div className="space-y-4">
          {notification &&
            notification.map((notification) => (
              <div
                key={notification._id}
                className={`flex items-start space-x-4 p-3 rounded-lg ${
                  notification.isRead ? "bg-gray-100" : "bg-blue-50"
                }`}
              >
                <Avatar src={notification.from} className="w-10 h-10" />
                <div className="flex-grow">
                  <div className=" flex gap-3">
                    <h3 className="font-semibold">{notification.heading}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString(
                        "en-US"
                      )}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {notification.message}
                  </p>
                </div>
                {notification.url && (
                <Button 
                  size="sm" 
                  color="primary" 
                  variant="flat"
                  onPress={() => router.push(notification.url)}
                >
                  go to
                </Button>
              )}
              </div>
            ))}
        </div>
      </CardBody>
    </Card>
  );
}
