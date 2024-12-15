"use client";
import Category from "@/interfaces/category";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiUpload } from "react-icons/fi";
import PackageFormData from "./PackageFormData";
import Description from "./Description";
import Itineraries from "./Itineraries";
import { Itinerary, PackageFormValues } from "@/interfaces/package";
import IncludedAndExcluded from "./IncludedAndExcluded";
import { deleteImageUrl, updateImageURL } from "@/config/agent/packageservice";
import { extractPublicId } from "cloudinary-build-url";
import uploadToCloudinary from "@/lib/cloudinary";

interface PackageFormProps {
  initialData?: PackageFormValues;
  categories: Category[];
  onSubmit: (data: PackageFormValues) => void;
  formTitle: string;
}

export default function PackageForm({
  initialData,
  categories,
  onSubmit,
  formTitle,
}: PackageFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
    setError,
  } = useForm<PackageFormValues>({
    defaultValues: {
      destinations: [""],
      images: [],
      includedItems: [""],
      excludedItems: [""],
      ...initialData,
    },
  });
  const [images, setImages] = useState<File[]>([]);
  const [includedItems, setIncludedItems] = useState<string[]>([]);
  const [excludedItems, setExcludedItems] = useState<string[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([
    { day: 1, activities: [{ time: "", activity: "" }] },
  ]);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setImages(initialData.images || []);
      setItineraries(initialData.itineraries || []);
      setIncludedItems(initialData.includedItems || []);
      setExcludedItems(initialData.excludedItems || []);
    }
  }, [initialData, reset, setValue]);

  const acceptedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/jpg",
  ];
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (images.length >= 6) {
      setError("images", { type: "manual", message: "maximum 6 images" });
      return;
    }
    if (files) {
      const validImages = Array.from(files).filter((file) =>
        acceptedFileTypes.includes(file.type)
      );
      const remainingSlots = 6 - images.length;
      const imagesToAdd = validImages.slice(0, remainingSlots);

      if (imagesToAdd.length > 0) {
        try {
          const uploadedImages = await Promise.all(
            imagesToAdd.map(async (image) => {
              return await uploadToCloudinary(image);
            })
          );

          const updatedImages = [...images, ...uploadedImages];
          setImages(updatedImages);
          setValue("images", updatedImages);
          toast.success("Images uploaded successfully");
        } catch (error) {
          console.error("Error uploading images:", error);
          setError("images", {
            type: "manual",
            message: "Failed to upload images. Please try again.",
          });
        }
      } else {
        setError("images", {
          type: "manual",
          message: "Please select valid image",
        });
      }
    }
  };

  const handleDelete = async (index: number) => {
    const imageToDelete = images[index];
    const publicId = extractPublicId(imageToDelete as unknown as string);
    try {
      const response = await deleteImageUrl(publicId);
      if (response.success) {
        toast.success("image deleted");
      }
    } catch (error) {
      throw error;
    }
    setImages((currentImages) => {
      const updatedImages = currentImages.filter((_, i) => i !== index);

      return updatedImages;
    });
    // const updatedImages = images.filter((_, i) => i !== index);
    // setImages(updatedImages);
    // setValue("images", updatedImages);
    setValue("images", images);
    toast.success("Image deleted successfully");
  };

  const handleChange = (index: number) => {
    const oldImage = images[index];
    // const publicId=getPublicIdFromUrl(oldImage as unknown as string)
    const publicId = extractPublicId(oldImage as unknown as string);
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // Only allow image selection

    fileInput.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;

      if (target && target.files && target.files[0]) {
        let newImageFile: File | string = target.files[0];
        if (!acceptedFileTypes.includes(newImageFile.type)) {
          setError("images", {
            type: "manual",
            message: "Please select valid image",
          });
          return;
        }
        try {
          const formData = new FormData();
          formData.append("file", newImageFile);
          formData.append("oldPublicId", publicId as string);
          const response = await updateImageURL(formData);
          if (response.success) {
            newImageFile = response.imageUrl;
          } else {
            throw new Error("Image update failed");
          }
        } catch (error) {
          console.error("Error updating image:", error);
          setError("images", {
            type: "manual",
            message: "Failed to update image. Please try again.",
          });
          return;
        }
        const updatedImages = [...images];
        updatedImages[index] = newImageFile as unknown as File;

        setImages(updatedImages);
        setValue("images", updatedImages);

        toast.success("Image uploaded successfully");
      } else {
        setError("images", {
          type: "manual",
          message: "Please select an image",
        });
      }
    };

    fileInput.click(); // Open the file dialog
  };

  
  const onSubmitHandler = (data: PackageFormValues) => {
    const formData = new FormData();
    formData.append("packageName", data.package_name);
    formData.append("maxPerson", data.max_person.toString());
    formData.append("noOfDays", data.no_of_days.toString());
    formData.append("noOfNights", data.no_of_nights.toString());
    formData.append("price", data.original_price.toString());
    formData.append("category_id", JSON.stringify(data.category_id));
    formData.append("destinations", JSON.stringify(data.destinations));
    formData.append("itineraries", JSON.stringify(data.itineraries));
    formData.append("includedItems", JSON.stringify(data.includedItems));
    formData.append("excludedItems", JSON.stringify(data.excludedItems));
    formData.append("description", JSON.stringify(data.description));
    formData.append("departure", JSON.stringify(data.departure_place));
    images.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
    const packageFormValues: PackageFormValues = {
      package_name: data.package_name,
      category_id: JSON.parse(formData.get("category_id") as string),
      max_person: parseInt(formData.get("maxPerson") as string),
      no_of_days: parseInt(formData.get("noOfDays") as string),
      no_of_nights: parseInt(formData.get("noOfNights") as string),
      original_price: parseInt(formData.get("price") as string),
      destinations: JSON.parse(formData.get("destinations") as string),
      itineraries: JSON.parse(formData.get("itineraries") as string),
      includedItems: JSON.parse(formData.get("includedItems") as string),
      excludedItems: JSON.parse(formData.get("excludedItems") as string),
      description: JSON.parse(formData.get("description") as string),
      departure_place: JSON.parse(formData.get("departure") as string),
      images: images,
    };
    onSubmit(packageFormValues);
  };
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <PackageFormData
        register={register}
        errors={errors}
        categories={categories}
        formTitle={formTitle}
        getValues={getValues}
        setValue={setValue}
        itineraries={itineraries}
        setItineraries={setItineraries}
        initialData={initialData}
      />
      <Description
        register={register}
        errors={errors}
        initialData={initialData}
        setValue={setValue}
      />
      <Itineraries
        register={register}
        errors={errors}
        setValue={setValue}
        itineraries={itineraries}
        setItineraries={setItineraries}
      />
      <IncludedAndExcluded
        register={register}
        errors={errors}
        setValue={setValue}
        includedItems={includedItems}
        excludedItems={excludedItems}
        setIncludedItems={setIncludedItems}
        setExcludedItems={setExcludedItems}
      />

      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-8">
        <h1 className="text-2xl font-bold mb-4">Images</h1>
        <p className="text-gray-600 mb-4">
          Upload images related to the package.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full  h-[450px] bg-slate-100 p-4 shadow-inner">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group w-[300px] h-[200px] overflow-hidden rounded-md border border-gray-300"
            >
              {image instanceof File ? (
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`Uploaded image ${index + 1}`}
                  width={300}
                  height={200}
                  className="object-cover w-full h-full"
                  onLoad={() => URL.revokeObjectURL(URL.createObjectURL(image))} // Clean up URL
                />
              ) : (
                <Image
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  width={300}
                  height={200}
                  className="object-cover w-full h-full"
                  // onLoad={() => URL.revokeObjectURL(URL.createObjectURL(image))} // Clean up URL
                />
              )}

              <input
                type="file"
                id={`image-input-${index}`}
                onChange={(e) => handleImageChange(e)}
                className="hidden"
              />

              {/* Centered Icons */}
              <div className="absolute inset-0 flex justify-center items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                <Button
                  onClick={() => handleChange(index)}
                  className="bg-white/80 p-2 rounded-full"
                >
                  <FiEdit2 size={20} color="black" />
                </Button>

                <Button
                  onClick={() => handleDelete(index)}
                  className="bg-white/80 p-2 rounded-full"
                >
                  <FiTrash2 size={20} color="black" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <label htmlFor="upload-input" className="mt-4 cursor-pointer flex ">
          <FiUpload size={24} className="inline-block mr-2" /> Upload Images
        </label>
        <input
          type="file"
          id="upload-input"
          multiple
          className="hidden"
          {...register("images", {
            validate: {
              // Ensure at least one file is selected
              notEmpty: (files) =>
                files?.length > 0 || "You must select at least one file.",
            },
          })}
          onChange={handleImageChange}
        />

        <p className="text-red-500 text-xs py-2">
          {errors.images?.message || ""}
        </p>
      </div>

      <div className=" mx-auto  p-8  mt-8 flex justify-end">
        <Button type="submit" className="bg-yellow-700 hover:bg-yellow-800">
          {initialData ? "Save Changes" : "Create Package"}
        </Button>
      </div>
    </form>
  );
}
