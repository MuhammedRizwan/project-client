import { Button, Image } from "@nextui-org/react";
import { FiEdit2, FiTrash2, FiUpload } from "react-icons/fi";
import { UseFormRegister, UseFormSetError, UseFormSetValue } from "react-hook-form";
import { PackageFormValues } from "@/interfaces/package";

interface ImageProps {
  images: File[] | string[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  setError: UseFormSetError<PackageFormValues>;
  setValue: UseFormSetValue<PackageFormValues>;
  register: UseFormRegister<PackageFormValues>;
}

export default function ImageAddEdit({
  images,
  setImages,
  setError,
  setValue,
  register,
}: ImageProps) {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || images.length >= 6) return;

    const acceptedFileTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/jpg",
    ];

    const validImages = Array.from(files).filter((file) =>
      acceptedFileTypes.includes(file.type)
    );
    const remainingSlots = 6 - images.length;
    const imagesToAdd = validImages.slice(0, remainingSlots);

    if (imagesToAdd.length > 0) {
      const updatedImages = [...images, ...imagesToAdd].map((image) =>
        image instanceof File ? image : new File([image], "image")
      );
      setImages(updatedImages);
      setValue("images", updatedImages); // Sync with form
    } else {
      setError("images", {
        type: "manual",
        message: "Please select a valid image.",
      });
    }
  };

  const handleDelete = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index) as
      | File[]
      | string[];
    setImages(updatedImages as File[]);
    setValue("images", updatedImages as File[]);
  };

  const handleChange = (index: number) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target && target.files && target.files[0]) {
        const newImageFile = target.files[0];
        const acceptedFileTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/svg+xml",
          "image/jpg",
        ];

        if (!acceptedFileTypes.includes(newImageFile.type)) {
          setError("images", {
            type: "manual",
            message: "Please select a valid image.",
          });
          return;
        }

        const updatedImages = images.map((image) =>
          image instanceof File ? image : new File([image], "image")
        );
        updatedImages[index] = newImageFile;

        setImages(updatedImages);
        setValue("images", updatedImages);
      } else {
        setError("images", {
          type: "manual",
          message: "Please select an image.",
        });
      }
    };
    fileInput.click();
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-8">
      <h1 className="text-2xl font-bold mb-4">Images</h1>
      <p className="text-gray-600 mb-4">
        Upload images related to the package.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full h-[450px] bg-slate-100 p-4 shadow-inner">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group w-[300px] h-[200px] overflow-hidden rounded-md border border-gray-300"
          >
            <Image
              src={image instanceof File ? URL.createObjectURL(image) : image}
              alt={`Uploaded image ${index + 1}`}
              width={300}
              height={200}
              className="object-cover w-full h-full"
              onLoad={() =>
                image instanceof File &&
                URL.revokeObjectURL(URL.createObjectURL(image))
              }
            />

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

      <label htmlFor="upload-input" className="mt-4 cursor-pointer flex">
        <FiUpload size={24} className="inline-block mr-2" /> Upload Images
      </label>
      <input
        type="file"
        id="upload-input"
        multiple
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
}
