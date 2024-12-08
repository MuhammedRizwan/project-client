import { Card, CardBody } from "@nextui-org/react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  color: string;
  title: string;
  value: string | number;
  percentage: string;
}

const MetricCard = ({ icon: Icon, color, title, value, percentage }: MetricCardProps) => {
  return (
    <Card className={`bg-${color}`}>
      <CardBody className="text-white">
        <div className="flex justify-between items-center mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Icon className="w-6 h-6" />
          </div>
          <span>•••</span>
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

export default MetricCard;