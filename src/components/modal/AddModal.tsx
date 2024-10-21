import { Button } from "@nextui-org/react";
import React from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const AddModal: React.FC<ModalProps> = ({
  title,
  onClose,
  children,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-1/2 p-6 rounded shadow-lg">
        <h2 className="text-lg font-extrabold mb-4">{title}</h2>
        <div className="mb-4">{children}</div>
        <div className="flex justify-end">
          <Button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded mr-2"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
export default AddModal;