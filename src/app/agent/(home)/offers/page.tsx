"use client";
import BlockModal from "@/components/modal/blockModal";
import Table, { TableColumn } from "@/components/Table";
import Offer from "@/interfaces/offer";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";


export default function CouponsPage() {
  const [, setOffer] = useState<Offer[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Offer | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const offerColumns: TableColumn<Offer>[] = [
    { key: "package_id", label: "Package Name" },
    { key: "percentage", label: "Percentage" },
    { key: "max_amount", label: "Max Amount" },
    {
      key: "valid_upto",
      label: "Valid Upto",
      render: (offer: Offer) => (
        <span className="text-blue-500">
          {new Date(offer.valid_upto).toLocaleDateString("en-US", {
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
      render: (offer: Offer) => (
        <button
          onClick={() => handleBlockClick(offer)}
          className={`px-4 py-2 ${
            offer.is_active ? "bg-red-500": "bg-green-500" 
          } text-white rounded w-20`}
        >
          {offer.is_active ?"Block":"Unblock" }
        </button>
      ),
    },
    {
      key: "_id",
      label: "Edit",
      render: (offer: Offer) => (
        <button
          onClick={() => openModal("edit", offer)}
          className="px-4 py-2 bg-blue-500 text-white rounded w-20"
        >
          Edit
        </button>
      ),
    },
  ];
  const openModal = (mode: "add" | "edit", offer?: Offer) => {
    setSelectedCoupon(offer || null);
    setModalMode(mode);
    setShowModal(true);
  };
  const handleBlockClick = (offer: Offer) => {
    setSelectedCoupon(offer);
    setShowBlockModal(true);
  };

  const BlockCoupon = async () => {
    try {
      const response = await block_coupon(selectedCoupon?._id,{is_active: !selectedCoupon?.is_active});
      if (response.success) {
        const { offer } = response;
        setOffer((prevOffer) =>
          prevOffer.map((offer) =>
            offer._id === offer._id ? offer : offer
          )
        );
      }
    } catch (error) {
      handleAxiosError(error, "Error updating coupon");
    } finally {
      setShowBlockModal(false);
    }
  };

 

  const handleCouponSubmit = async (data: Offer) => {
    try {
      const url =
        modalMode === "add"
          ? "/coupon/create"
          : `/coupon/edit/${selectedCoupon?._id}`;
      const method = modalMode === "add" ? "post" : "put";

      const response = await add_edit_coupon(url, method, data );
      if (response.success && response.message =="Coupon Created") {
        const { offerData } = response;
        setOffer((prevOffer) => [...prevOffer, offerData]);
        setShowModal(false);
        toast.success(`Coupon added successfully`);
      }
      if (response.success && response.message=="Coupon Edited") {
        const { offerData } = response;
        setOffer((prevOffer) =>
          prevOffer.map((offer) =>
            offer._id === offerData._id ? offerData : offer
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
  const addCoupon=()=>{
    openModal("add")
 }

  const apiUrl = "/offer";
  return (
    <>
    
      <Table<Offer> columns={offerColumns} apiUrl={apiUrl} 
        addButton={addCoupon}
        buttonName="Add Coupon"/>

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
    </>
  );
}
