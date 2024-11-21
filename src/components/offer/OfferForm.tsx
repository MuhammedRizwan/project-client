"use client";
import React, { useEffect, useState } from "react";
import { Input, Textarea, Switch, Button, Image } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import Offer from "@/interfaces/offer";
import { MdChangeCircle } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import Package from "@/interfaces/package";
import PackageSelector from "./PackageSelector";

type OfferFormProps = {
  onSubmit: (data: Offer) => void;
  offer?: Offer | null;
  loading: boolean;
  packages?: Package[];
};

export default function OfferForm({
  onSubmit,
  offer,
  loading,
  packages,
}: OfferFormProps) {
  const {
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Offer>();

  useEffect(() => {
    if (offer) {
      reset({
        ...offer,
        valid_from: offer.valid_from
          ? (offer.valid_from as string).split("T")[0]
          : "",
        valid_upto: offer.valid_upto
          ? (offer.valid_upto as string).split("T")[0]
          : "",
      });
      setSelectedFile(offer.image || null);
    }
  }, [offer, reset]);

  const [validUpto, setValidUpto] = useState<Date | string>(
    offer?.valid_upto || ""
  );
  const [validFrom, setValidFrom] = useState<Date | string>(
    offer?.valid_from || ""
  );

  const [selectedFile, setSelectedFile] = useState<File | string | null>(
    offer?.image || null
  );

  useEffect(() => {
    setValue("image", selectedFile);
  }, [selectedFile, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      const validFormats = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];
      if (!validFormats.includes(file.type)) {
        setError("image", {
          message: "Invalid file format. Only JPG and PNG are allowed.",
        });
      } else {
        clearErrors("image");
        setSelectedFile(file);
      }
    } else {
      setSelectedFile(null);
    }
  };

  const validateImage = () => {
    if (!selectedFile) {
      setError("image", { type: "manual", message: "Image is required" });
      return false;
    }
    return true;
  };

  const onSubmitForm = (data: Offer) => {
    const isImageValid = validateImage();
    if (isImageValid) {
      onSubmit(data);
    }
  };
  const today = new Date().toISOString().split("T")[0];
  const twoYearsFromToday = new Date(
    new Date().setFullYear(new Date().getFullYear() + 2)
  )
    .toISOString()
    .split("T")[0];
  return (
    <div className="w-full bg-white">
      <div>
        <h1 className="text-2xl font-semibold mb-4">
          {offer ? "Edit Offer" : "Create Offer"}
        </h1>
      </div>
      <div className="p-3">
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Input
            {...register("offer_name", {
              required: "offer name is required",
            })}
            label="offer name"
            placeholder="Enter offer code"
          />
          <p className="text-red-500 text-xs h-[20px]">
            {errors.offer_name?.message || ""}
          </p>

          <Textarea
            {...register("description", {
              required: "Description is required",
              minLength: { value: 10, message: "Minimum length is 10" },
              maxLength: { value: 200, message: "Maximum length is 200" },
            })}
            label="Description"
            placeholder="Enter offer description"
          />
          <p className="text-red-500 text-xs h-[20px]">
            {errors.description?.message || ""}
          </p>
          <div className=" h-full">
            {packages && packages.length > 0 ? (
              <PackageSelector
                packages={packages}
                setValue={setValue}
                selectedPackage={offer?.package_id}
              />
            ) : (
              <p>no Packages</p>
            )}
          </div>

          <div className="w-full flex gap-4 justify-between">
            <div className="w-1/2">
              <Input
                {...register("percentage", {
                  required: "Percentage is required",
                  min: { value: 0, message: "Minimum value is 0" },
                  max: { value: 100, message: "Maximum value is 100" },
                })}
                type="number"
                label="Percentage"
                placeholder="Enter discount percentage"
              />
              <p className="text-red-500 text-xs h-[20px]">
                {errors.percentage?.message || ""}
              </p>
            </div>
            <div className="w-1/2">
              <Input
                {...register("max_offer", {
                  required: "Max amount is required",
                  min: { value: 0, message: "Minimum value is 0" },
                  max: { value: 10000, message: "Maximum value is 10000" },
                })}
                type="number"
                label="Max Amount"
                placeholder="Enter maximum discount amount"
              />
              <p className="text-red-500 text-xs h-[20px]">
                {errors.max_offer?.message || ""}
              </p>
            </div>
          </div>

          <div className="w-full flex gap-4 justify-between">
            <div className="w-1/2">
              <Input
                type="date"
                min={today}
                {...register("valid_from", {
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
                value={validFrom.toString().split("T")[0] || ""}
                onChange={(e) => setValidFrom(e.target.value)}
              />
              <p className="text-red-500 text-xs m-0 h-[20px]">
                {errors.valid_from?.message || ""}
              </p>
            </div>
            <div className="w-1/2">
              <Input
                type="date"
                min={today}
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
              <p className="text-red-500 text-xs m-0 h-[20px]">
                {errors.valid_upto?.message || ""}
              </p>
            </div>
          </div>
          <div className="relative w-40 h-40 mt-4 rounded overflow-hidden">
            {selectedFile ? (
              <Image
                src={
                  typeof selectedFile === "string"
                    ? selectedFile
                    : URL.createObjectURL(selectedFile)
                }
                alt="Selected File"
                className="w-full h-[160px] object-fill"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="font-semibold">No Image Selected</span>
              </div>
            )}

            {selectedFile && (
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <label
                  htmlFor="file-input"
                  className="text-white font-bold cursor-pointer flex flex-col items-center"
                >
                  <MdChangeCircle size={24} className="mb-1" color="black" />
                </label>
              </div>
            )}
          </div>
          {selectedFile == null && (
            <div>
              <label
                htmlFor="file-input"
                className="cursor-pointer text-black-500 flex"
              >
                <FiUpload size={28} className="mb-1" />
                Upload Image
              </label>
            </div>
          )}
          <p className="text-red-600 text-xs">{errors.image?.message}</p>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center justify-between">
            <span>Is Active</span>
            <Switch {...register("is_active")} />
          </div>
          <div className="flex items-center justify-end">
            <Button
              type="submit"
              className="mt-4"
              color="primary"
              isLoading={loading}
            >
              {offer ? "update offer" : "save offer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
