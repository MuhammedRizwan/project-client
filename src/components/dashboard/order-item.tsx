import { Avatar, Button } from "@nextui-org/react";
import { UserCog } from "lucide-react";
import { useRouter } from "next/navigation";

interface ConfirmAgentProps {
  color: string;
  description: string;
  date: string;
  id: string|undefined;
  pic:string|File|undefined
}

export default function ConfirmAgent ({color, description,pic, date, id }: ConfirmAgentProps) {
  const router=useRouter()
  return (
    <div className="flex gap-4">
      <div
        className={`w-8 h-8 bg-${color}-100 rounded flex items-center justify-center text-${color}-500`}
      >
        <Avatar 
        src={pic as string || '/logos/avatar.avif'}
        alt={description}
        />
      </div>
      <div className="w-full flex justify-between">
        <div>
        <p className="font-medium">{description}</p>
        <p className="text-sm text-gray-500">{date}</p>
        </div>
        <div>
        <Button className="bg-zinc-900 text-white rounded-e" onClick={()=>router.push(`/admin/travel-agencies/${id}`)}>verify</Button>
        </div>
      </div>
    </div>
  );
};
