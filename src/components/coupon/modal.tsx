import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Switch } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import Coupon from "@/interfaces/coupon";

type CouponModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Coupon) => void;
  coupon: Coupon | null;
  mode: "add" | "edit";
};

export default function CouponModal({ isOpen, onClose, onSubmit, coupon, mode }: CouponModalProps) {
    console.log(coupon)
  const { register, handleSubmit, formState: { errors }} = useForm<Coupon>();
  const [validUpto, setValidUpto] = useState<string>("");

  // Helper functions for date formatting
  const formatDateToInput = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateToISO = (dateString: string) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`; // Converts back to ISO for the backend
  };

  // Set default value when editing a coupon
  useEffect(() => {
    if (coupon?.valid_upto) {
      setValidUpto(formatDateToInput(coupon.valid_upto.toString()));
    }
  }, [coupon]);

  const onSubmitForm = (data: Coupon) => {
    data.valid_upto =new Date (formatDateToISO(validUpto)); // Convert to ISO before submitting
    onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <ModalHeader className="flex flex-col gap-1">
            {mode === "add" ? "Add New Coupon" : "Edit Coupon"}
          </ModalHeader>
          <ModalBody>
            <Input
              {...register("coupon_code", { required: "Coupon code is required" })}
              label="Coupon Code"
              placeholder="Enter coupon code"
              errorMessage={errors.coupon_code?.message}
              defaultValue={coupon?.coupon_code || ""}
            />

            <Textarea
              {...register("description", { required: "Description is required" })}
              label="Description"
              placeholder="Enter coupon description"
              errorMessage={errors.description?.message}
              defaultValue={coupon?.description || ""}
            />

            <Input
              {...register("percentage", {
                required: "Percentage is required",
                min: { value: 0, message: "Minimum value is 0" },
                max: { value: 100, message: "Maximum value is 100" },
              })}
              type="number"
              label="Percentage"
              placeholder="Enter discount percentage"
              errorMessage={errors.percentage?.message}
              defaultValue={coupon?.percentage || ""}
            />

            <Input
              {...register("max_amount", {
                required: "Max amount is required",
                min: { value: 0, message: "Minimum value is 0" },
              })}
              type="number"
              label="Max Amount"
              placeholder="Enter maximum discount amount"
              errorMessage={errors.max_amount?.message}
              defaultValue={coupon?.max_amount.toString() || ""}
            />

            <Input
              type="text"
              label="Valid Up To"
              placeholder="DD-MM-YYYY"
              value={validUpto}
              onChange={(e) => setValidUpto(e.target.value)}
              errorMessage={errors.valid_upto?.message}
            />

            <div className="flex items-center justify-between">
              <span>Is Active</span>
              <Switch
                {...register("is_active")}
                defaultSelected={coupon?.is_active }
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              {mode === "add" ? "Add Coupon" : "Save Changes"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
