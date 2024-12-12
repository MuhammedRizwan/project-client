import { Card, CardBody, Skeleton } from "@nextui-org/react"
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface MetricCardProps {
  icon: LucideIcon;
  color: string;
  title: string;
  value: string | number;
  percentage: string;
  route?:string
}

const MetricCard = ({ icon: Icon, color, title, value, percentage ,route }: MetricCardProps) => {
  const router=useRouter()
  return (
    <Card className={`${color}`}>
      <CardBody className="text-white">
        <div className="flex justify-between items-center mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Icon className="w-6 h-6" />
          </div>
          <span onClick={()=>router.push((route as string))} className="cursor-pointer">•••</span>
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="flex justify-between">
          <span>{title}</span>
          <span className="text-white/90">{percentage}</span>
        </div>
      </CardBody>
    </Card>
  );
};


export  function MetricCardSkeleton() {
  return (
    <Card className="w-full">
      <CardBody className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="rounded-lg w-10 h-10" />
          <Skeleton className="w-6 h-4 rounded" />
        </div>
        <Skeleton className="w-3/4 h-8 rounded mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="w-20 h-4 rounded" />
          <Skeleton className="w-12 h-4 rounded" />
        </div>
      </CardBody>
    </Card>
  )
}

export default MetricCard;