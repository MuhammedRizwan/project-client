"use client";
import { Card, CardBody, Avatar, Button } from "@nextui-org/react";
import INotification from "@/interfaces/notification";
import { useRouter } from "next/navigation";


export default function NotificationList({
  notification,
}: {
  notification: INotification[] | null;
}) {
    const router=useRouter()
  return (
    <Card className="min-w-full">
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
                  color="secondary" 
                  variant="flat"
                  onPress={() => router.push(notification.url)}
                  className="my-auto"
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
