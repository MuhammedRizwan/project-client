import {  Card, CardBody } from "@nextui-org/react";
import { UserCog } from "lucide-react";

export default function Notification() {
  return (
    <Card>
      <CardBody>
        <h2 className="text-xl font-black mb-5">New Notification</h2>
        <div className="flex gap-4">
          <div
            className={`w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-grey-500`}
          >
            <UserCog />
          </div>
          <div className="w-full flex justify-between">
            <div>
              {/* <p className="font-medium">{description}</p> */}
              {/* <p className="text-sm text-gray-500">{date}</p> */}
            </div>
            <div>
              {/* <Button
                className="bg-zinc-900 text-white rounded-e"
                onClick={() => router.push(`/admin/travel-agencies/${id}`)}
              >
                verify
              </Button> */}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
