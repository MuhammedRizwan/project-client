import React from "react";
import { Ban } from "lucide-react";

interface ModalProps {
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
}

const BlockModal: React.FC<ModalProps> = ({
  title,
  onClose,
  onConfirm,
  children,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-black  w-[500px] h-[200px] p-6 rounded-lg shadow-lg">
      {/* Title and Icon in a Single Line */}
      <div className="flex items-center justify-normal mb-3">
        <h2 className="text-lg font-semibold text-gray-200">{title}</h2>
        <Ban size={24} className="text-red-500" />
      </div>
      <div className="mb-4 text-gray-200">{children}</div>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-green-600 rounded mr-2"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-white text-black rounded"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
  
  );
};
export default BlockModal;
