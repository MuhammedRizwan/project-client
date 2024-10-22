import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input, Textarea, Button, Image } from "@nextui-org/react";
import { FiUpload } from "react-icons/fi";
import { MdChangeCircle } from "react-icons/md";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<CategoryFormValues>;
  initialData?: CategoryFormValues;
  title: string;
  loading: boolean;
}

export interface CategoryFormValues {
  category_name: string;
  description: string;
  image?: File | string | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = { category_name: "", description: "", image: null },
  title,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm<CategoryFormValues>({ defaultValues: initialData });

  const [selectedFile, setSelectedFile] = useState<File | string | null>(
    initialData.image || null
  );

  useEffect(() => {
    setValue("image", selectedFile);
  }, [selectedFile, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
  
    if (file) {
      const validFormats = ['image/jpeg', 'image/png', 'image/jpg','image/webp']; 
      if (!validFormats.includes(file.type)) {
        setError("image", { message: "Invalid file format. Only JPG and PNG are allowed." });
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

  const onSubmitWithValidation: SubmitHandler<CategoryFormValues> = async (data) => {
    const isImageValid = validateImage();
    const isFormValid = await trigger();

    if (isImageValid && isFormValid) {
      onSubmit(data);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-1/2 p-6 rounded shadow-lg">
        <h2 className="text-lg font-extrabold mb-4">{title}</h2>
        <form onSubmit={handleSubmit(onSubmitWithValidation)}>
          <label className="block mb-2 font-bold">Category Name</label>
          <Input
            {...register("category_name", {
              required: "Category Name is required",
              minLength: { value: 5, message: "At least 5 characters" },
              maxLength: { value: 30, message: "At most 30 characters" },
            })}
            placeholder="Enter Category Name"
            className="w-full mb-2"
          />
          <p className="text-red-600 text-xs mb-4">
            {errors.category_name?.message}
          </p>

          <label className="block mb-2 font-bold">Description</label>
          <Textarea
            {...register("description", {
              required: "Description is required",
              minLength: { value: 5, message: "At least 5 characters" },
              maxLength: { value: 500, message: "At most 500 characters" },
            })}
            className="w-full mb-2"
          />
          <p className="text-red-600 text-xs mb-4">
            {errors.description?.message}
          </p>

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

          {title === "Add Category" && selectedFile==null && (
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

          <div className="flex justify-end mt-6">
            <Button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded mr-2"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} className="bg-green-500 text-white">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
