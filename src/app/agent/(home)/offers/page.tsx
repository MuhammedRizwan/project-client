"use client";
 import BlockModal from "@/components/modal/blockModal";
import Table, { TableColumn } from "@/components/Table";
import { block_offer } from "@/config/agent/offerservice";
import Offer from "@/interfaces/offer";
import { RootState } from "@/store/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";


export default function OfferPage() {
    const router=useRouter();
    const [offer,setOffer]=useState<Offer[]>([])
    const agent = useSelector((state: RootState) => state.agent.agent);
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const offerColumns: TableColumn<Offer>[] = [
    { key: "offer_name", label: "Offer Name" },
    { key: "percentage", label: "Percentage" },
    { key: "max_offer", label: "Max Offer" },
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
          onClick={() => router.push(`/agent/offers/${offer._id}`)}
          className="px-4 py-2 bg-blue-500 text-white rounded w-20"
        >
          Edit
        </button>
      ),
    },
  ];

  const handleBlockClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setShowBlockModal(true);
  };

  const Blockoffer = async () => {
    try {
      const response = await block_offer(selectedOffer?._id,{is_active: !selectedOffer?.is_active});
      if (response.success) {
        toast.success(response.offer?.is_active ? "Offer blocked" : "Offer unblocked");
       
      }
    } catch (error) {
      handleAxiosError(error, "Error updating offer");
    } finally {
      setShowBlockModal(false);
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


  const addoffer=()=>{
    router.push("/agent/offers/add");
 }


  const apiUrl = `/offer/${agent?._id}`;
  return (
    <>
      <Table<Offer> columns={offerColumns} apiUrl={apiUrl} 
        addButton={addoffer}
        buttonName="Add offer"
        data={offer}
        setData={setOffer}
        />

     

      {showBlockModal && selectedOffer && (
        <BlockModal
          title="Confirm Block/Unblock"
          onClose={() => setShowBlockModal(false)}
          onConfirm={Blockoffer}
        >
          <p>
            Are you sure you want to{" "}
            {selectedOffer.is_active ? "block" : "unblock"}{" "}
            {selectedOffer.offer_name}?
          </p>
        </BlockModal>
      )}
    </>
  );
}
