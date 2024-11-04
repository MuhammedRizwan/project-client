"use client";
import BlockModal from "@/components/modal/blockModal";
import Table, { TableColumn } from "@/components/Table";
import Coupon from "@/interfaces/coupon";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import CouponModal from "@/components/coupon/modal";
import { Button } from "@nextui-org/react";
import { add_edit_coupon, block_coupon } from "@/api/admin/couponservice";


export default function CouponsPage() {
  const [, setCoupons] = useState<Coupon[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const couponColumns: TableColumn<Coupon>[] = [
    { key: "coupon_code", label: "Coupon Code" },
    { key: "percentage", label: "Percentage" },
    { key: "max_amount", label: "Max Amount" },
    {
      key: "valid_upto",
      label: "Valid Upto",
      render: (coupon: Coupon) => (
        <span className="text-blue-500">
          {new Date(coupon.valid_upto).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Action",
      render: (coupon: Coupon) => (
        <button
          onClick={() => handleBlockClick(coupon)}
          className={`px-4 py-2 ${
            coupon.is_active ? "bg-red-500": "bg-green-500" 
          } text-white rounded w-20`}
        >
          {coupon.is_active ?"Block":"Unblock" }
        </button>
      ),
    },
    {
      key: "_id",
      label: "Edit",
      render: (coupon: Coupon) => (
        <button
          onClick={() => openModal("edit", coupon)}
          className="px-4 py-2 bg-blue-500 text-white rounded w-20"
        >
          Edit
        </button>
      ),
    },
  ];
  const openModal = (mode: "add" | "edit", coupon?: Coupon) => {
    setSelectedCoupon(coupon || null);
    setModalMode(mode);
    setShowModal(true);
  };
  const handleBlockClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowBlockModal(true);
  };

  const BlockCoupon = async () => {
    try {
      const response = await block_coupon(selectedCoupon?._id,{is_active: !selectedCoupon?.is_active});
      if (response.success) {
        const { coupons } = response;
        setCoupons((prevCoupons) =>
          prevCoupons.map((coupon) =>
            coupon._id === coupons._id ? coupons : coupon
          )
        );
      }
    } catch (error) {
      handleAxiosError(error, "Error updating coupon");
    } finally {
      setShowBlockModal(false);
    }
  };

  const handleCouponSubmit = async (data: Coupon) => {
    console.log("data", data);
    try {
      const url =
        modalMode === "add"
          ? "/coupon/create"
          : `/coupon/edit/${selectedCoupon?._id}`;
      const method = modalMode === "add" ? "post" : "put";

      const response = await add_edit_coupon(url, method, data );
      if (response.status === 201) {
        const { couponCreated } = response.data;
        setCoupons((prevCoupons) => [...prevCoupons, couponCreated]);
        setShowModal(false);
        toast.success(`Coupon added successfully`);
      }
      if (response.status === 200) {
        const { couponEdited } = response.data;
        setCoupons((prevCoupons) =>
          prevCoupons.map((coupon) =>
            coupon._id === couponEdited._id ? couponEdited : coupon
          )
        );
        setShowModal(false);
        toast.success(`Coupon updated successfully`);
      }
    } catch (error) {
      handleAxiosError(error, "Error saving coupon");
    }
  };

  const handleAxiosError = (error: unknown, defaultMessage: string) => {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Fetching failed";
      toast.error(errorMessage);
    } else {
      toast.error(defaultMessage);
    }
  };

  const apiUrl = "/coupon";
  return (
    <div>
      <div className="mb-4 w-full flex justify-end">
        <Button
          className="px-4 py-2 bg-yellow-600 text-white rounded"
          onClick={() => openModal("add")}
        >
          Add Coupon
        </Button>
      </div>

      <Table<Coupon> columns={couponColumns} apiUrl={apiUrl} />

      {showModal && (
        <CouponModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleCouponSubmit}
          coupon={selectedCoupon}
          mode={modalMode}
        />
      )}

      {showBlockModal && selectedCoupon && (
        <BlockModal
          title="Confirm Block/Unblock"
          onClose={() => setShowBlockModal(false)}
          onConfirm={BlockCoupon}
        >
          <p>
            Are you sure you want to{" "}
            {selectedCoupon.is_active ? "block" : "unblock"}{" "}
            {selectedCoupon.coupon_code}?
          </p>
        </BlockModal>
      )}
    </div>
  );
}
