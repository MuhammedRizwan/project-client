import { Progress } from "@nextui-org/react";

interface ReviewProgressProps {
  label: string;
  percentage: number;
}

export const ReviewProgress = ({ label, percentage }: ReviewProgressProps) => {
  return (
    <>
      <div className="flex justify-between mb-2">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" color="warning" />
    </>
  );
};
