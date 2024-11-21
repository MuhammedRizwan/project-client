"use client";
import OfferForm from "@/components/offer/OfferForm";
import { fetch_offer_package, fetch_one_offers, update_offer } from "@/config/agent/offerservice";
import Offer from "@/interfaces/offer";
import Package from "@/interfaces/package";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditOfferPage({
  params,
}: {
  params: { offerId: string };
}) {
  const router = useRouter();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<Package[] | undefined>(undefined);
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await fetch_one_offers(params.offerId);
        if (response.success) {
          setOffer(response.offer);
          const packageResponse = await fetch_offer_package(
            response.offer.agent_id
          );
          if (packageResponse.success) {
            setPackages(packageResponse.packages);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOffer();
  }, [params.offerId]);
  const handleEditSubmit = async (data: Offer) => {
    try {
      setLoading(true);
      const response = await update_offer(params.offerId, data);
      if (response.success) {
        router.push("/agent/offers");
        toast.success(`offer updated successfully`);
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
      {offer && (
        <OfferForm
          onSubmit={handleEditSubmit}
          offer={offer}
          loading={loading}
          packages={packages}
        />
      )}
    </>
  );
}
