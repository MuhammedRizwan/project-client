"use client";
import OfferForm from "@/components/offer/OfferForm";
import { add_offer, fetch_offer_package } from "@/config/agent/offerservice";

import Offer from "@/interfaces/offer";
import Package from "@/interfaces/package";
import { RootState } from "@/store/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function AddOfferPage() {
  const router = useRouter();
  const agent = useSelector((state: RootState) => state.agent.agent);
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<Package[] | undefined>(undefined);
  useEffect(() => {
    const fetchPckages = async () => {
      const response = await fetch_offer_package(agent?._id);
      if (response.success) {
        setPackages(response.packages);
      }
    };
    fetchPckages();
  }, [agent]);
  const handleofferSubmit = async (data: Offer) => {
    try {
      setLoading(true);
      data.agent_id = agent?._id;
      const response = await add_offer(data);
      if (response.success) {
        router.push("/agent/offers");
        toast.success(`offer added successfully`);
      }
    } catch (error) {
      handleAxiosError(error, "Error saving offer");
    } finally {
      setLoading(false);
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
  return (
    <>
      {packages && packages.length>0 && (
        <OfferForm
          onSubmit={handleofferSubmit}
          loading={loading}
          packages={packages}
        />
      )}
    </>
  );
}
