import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Switch,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import Coupon from "@/interfaces/coupon";

type CouponModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Coupon) => void;
  coupon: Coupon | null;
  mode: "add" | "edit";
};

export default function CouponModal({
  isOpen,
  onClose,
  onSubmit,
  coupon,
  mode,
}: CouponModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Coupon>();
  const [validUpto, setValidUpto] = useState<Date|string>(coupon?.valid_upto || "");

  const onSubmitForm = (data: Coupon) => {
    onSubmit(data);
    onClose();
  };
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const twoYearsFromToday = new Date(
    new Date().setFullYear(new Date().getFullYear() + 2)
  ).toISOString().split("T")[0]; 

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <ModalHeader className="flex flex-col gap-1">
            {mode === "add" ? "Add New Coupon" : "Edit Coupon"}
          </ModalHeader>
          <ModalBody>
            <Input
              {...register("coupon_code", {
                required: "Coupon code is required",
              })}
              label="Coupon Code"
              placeholder="Enter coupon code"
              defaultValue={coupon?.coupon_code || ""}
            />
            <p className="text-red-500 text-xs">
              {errors.coupon_code?.message || ""}
            </p>

            <Textarea
              {...register("description", {
                required: "Description is required",
                minLength: { value: 10, message: "Minimum length is 10" },
                maxLength:{value: 200, message: "Maximum length is 200"},
              })}
              label="Description"
              placeholder="Enter coupon description"
              defaultValue={coupon?.description || ""}
            />
            <p className="text-red-500 text-xs">
              {errors.description?.message || ""}
            </p>
            <Input
              {...register("percentage", {
                required: "Percentage is required",
                min: { value: 0, message: "Minimum value is 0" },
                max: { value: 100, message: "Maximum value is 100" },
              })}
              type="number"
              label="Percentage"
              placeholder="Enter discount percentage"
              defaultValue={coupon?.percentage||" "}
            />
            <p className="text-red-500 text-xs">
              {errors.percentage?.message || ""}
            </p>

            <Input
              {...register("max_amount", {
                required: "Max amount is required",
                min: { value: 0, message: "Minimum value is 0" },
                max: { value: 10000, message: "Maximum value is 10000" },
              })}
              type="number"
              label="Max Amount"
              placeholder="Enter maximum discount amount"
              defaultValue={coupon?.max_amount.toString() || ""}
            />
            <p className="text-red-500 text-xs">
              {errors.max_amount?.message || ""}
            </p>
            <Input
              {...register("min_amount", {
                required: "Min amount is required",
                min: { value: 0, message: "Minimum value is 0" },
                max: { value: 10000, message: "Maximum value is 10000" },
              })}
              type="number"
              label="Min Amount"
              placeholder="Enter minimum discount amount"
              defaultValue={coupon?.max_amount.toString() || ""}
              className="m-0"
            />
            <p className="text-red-500 text-xs">
              {errors.min_amount?.message || ""}
            </p>
            <Input
              type="date"
              {...register("valid_upto", {
                required: "Date is required",
                validate: (value) => {
                  if (String(value) < today) {
                    return "Date cannot be in the past";
                  }
                  if (String(value) > twoYearsFromToday) {
                    return "Date cannot exceed one year from today";
                  }
                  return true;
                },
              })}
              value={validUpto.toString().split("T")[0] || ""}
              onChange={(e) => setValidUpto(e.target.value)}
            />
            <p className="text-red-500 text-xs m-0">
              {errors.valid_upto?.message || ""}
            </p>
            <div className="flex items-center justify-between">
              <span>Is Active</span>
              <Switch
                {...register("is_active")}
                defaultSelected={coupon?.is_active}
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
