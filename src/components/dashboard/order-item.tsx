interface OrderItemProps {
    icon: string;
    color: string;
    description: string;
    date: string;
  }
  
  const OrderItem = ({ icon, color, description, date }: OrderItemProps) => {
    return (
      <div className="flex gap-4">
        <div className={`w-8 h-8 bg-${color}-100 rounded flex items-center justify-center text-${color}-500`}>
          {icon}
        </div>
        <div>
          <p className="font-medium">{description}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
    );
  };
  
  export default OrderItem;
  