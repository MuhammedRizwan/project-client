"use client";
import BlockModal from "@/components/modal/blockModal";
import Table, { TableColumn } from "@/components/Table";
import Coupon from "@/interfaces/coupon";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CouponModal from "@/components/coupon/modal";
import { Button } from "@nextui-org/react";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  // Table columns definition
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
      label: "Is Active",
      render: (coupon: Coupon) => (
        <span
          className={coupon.is_active ? "text-green-500" : "text-yellow-500"}
        >
          {coupon.is_active ? "Active" : "Inactive"}
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
            coupon.is_active ? "bg-green-500" : "bg-red-500"
          } text-white rounded w-20`}
        >
          {coupon.is_active ? "Unblock" : "Block"}
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

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/admin/coupon");
        if (response.status === 200) {
          const { coupons } = response.data;
          setCoupons(coupons);
        }
      } catch (error) {
        handleAxiosError(error, "Error fetching coupons");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);
  const openModal = (mode: "add" | "edit", coupon?: Coupon) => {
    setSelectedCoupon(coupon || null);
    setModalMode(mode);
    setShowModal(true);
  };
  const handleBlockClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowBlockModal(true);
  };

  const confirmBlockUser = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/admin/coupon/block/${selectedCoupon?._id}`,
        {
          is_active: !selectedCoupon?.is_active,
        }
      );
      if (response.status === 200) {
        const { coupons } = response.data;
        console.log(coupons,"srguyifsdhguasifhgwyudagfashf8ygfahdusfgu");
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
    console.log("data",data)
    try {
      const url =
        modalMode === "add"
          ? "http://localhost:5000/admin/coupon/create"
          : `http://localhost:5000/admin/coupon/edit/${selectedCoupon?._id}`;
      const method = modalMode === "add" ? "post" : "put";

      const response = await axios({ url, method, data });
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

  if (loading) return <div>Loading...</div>;
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

      <Table columns={couponColumns} data={coupons} />

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
          onConfirm={confirmBlockUser}
        >
          <p>
            Are you sure you want to{" "}
            {selectedCoupon.is_active ? "unblock" : "block"}{" "}
            {selectedCoupon.coupon_code}?
          </p>
        </BlockModal>
      )}
    </div>
  );
}
