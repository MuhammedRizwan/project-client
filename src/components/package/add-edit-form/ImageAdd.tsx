// import React from 'react'
// import { FiEdit2, FiTrash2, FiUpload } from "react-icons/fi"
// import { FieldErrors, UseFormRegister, UseFormSetError, UseFormSetValue } from "react-hook-form"
// import Image from "next/image"
// import { Button, Input } from '@nextui-org/react'
// import { PackageFormValues } from '@/interfaces/package'

// interface ImageProps {
//   images: (File | string)[]
//   setImages: React.Dispatch<React.SetStateAction<File[]>>
//   setError: UseFormSetError<PackageFormValues>
//   setValue: UseFormSetValue<PackageFormValues>
//   register: UseFormRegister<PackageFormValues>
//   errors?: FieldErrors<PackageFormValues>
// }

// const acceptedFileTypes = [
//   "image/jpeg",
//   "image/png",
//   "image/gif",
//   "image/webp",
//   "image/svg+xml",
//   "image/jpg",
// ]

// export default function ImageAddEdit({
//   images,
//   setImages,
//   setError,
//   setValue,
//   register,
//   errors,
// }: ImageProps) {
//     const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const files = event.target.files
//         if (!files || images.length >= 6) return
      
//         const validImages = Array.from(files).filter((file) =>
//           acceptedFileTypes.includes(file.type)
//         )
//         const remainingSlots = 6 - images.length
//         const imagesToAdd = validImages.slice(0, remainingSlots).filter(
//           (image) => image instanceof File
//         ) as File[]
      
//         if (imagesToAdd.length > 0) {
//           const updatedImages = [...images, ...imagesToAdd]
//           setImages(updatedImages)
//           setValue("images", updatedImages.filter((image) => image instanceof File)
//         } else {
//           setError("images", {
//             type: "manual",
//             message: "Please select a valid image.",
//           })
//         }
//       }

//   const handleDelete = (index: number) => {
//     const updatedImages = images.filter((_, i) => i !== index)
//     setImages(updatedImages.filter((image) => image instanceof File))
//     setValue("images", updatedImages.filter((image) => image instanceof File)
//   }

//   const handleChange = (index: number) => {
//     const fileInput = document.createElement("input")
//     fileInput.type = "file"
//     fileInput.accept = "image/*"

//     fileInput.onchange = (event: Event) => {
//       const target = event.target as HTMLInputElement
//       if (target && target.files && target.files[0]) {
//         const newImageFile = target.files[0]

//         if (!acceptedFileTypes.includes(newImageFile.type)) {
//           setError("images", {
//             type: "manual",
//             message: "Please select a valid image.",
//           })
//           return
//         }

//         const updatedImages = [...images]
//         updatedImages[index] = newImageFile
//         setImages(updatedImages)
//         setValue("images", updatedImages)
//       } else {
//         setError("images", {
//           type: "manual",
//           message: "Please select an image.",
//         })
//       }
//     }
//     fileInput.click()
//   }

//   return (
//     <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-8">
//       <h1 className="text-2xl font-bold mb-4">Images</h1>
//       <p className="text-gray-600 mb-4">
//         Upload images related to the package.
//       </p>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full h-[450px] bg-slate-100 p-4 shadow-inner">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative group w-[300px] h-[200px] overflow-hidden rounded-md border border-gray-300"
//           >
//             <Image
//               src={image instanceof File ? URL.createObjectURL(image) : image}
//               alt={`Uploaded image ${index + 1}`}
//               width={300}
//               height={200}
//               className="object-cover w-full h-full"
//               onLoad={() =>
//                 image instanceof File &&
//                 URL.revokeObjectURL(URL.createObjectURL(image))
//               }
//             />

//             <div className="absolute inset-0 flex justify-center items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
//               <Button
//                 onClick={() => handleChange(index)}
//                 className="bg-white/80 p-2 rounded-full"
//               >
//                 <FiEdit2 className="h-5 w-5" />
//               </Button>

//               <Button
//                 onClick={() => handleDelete(index)}
//                 className="bg-white/80 p-2 rounded-full"
//               >
//                 <FiTrash2 className="h-5 w-5" />
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>

//       <label htmlFor="upload-input" className="mt-4 cursor-pointer flex items-center">
//         <FiUpload className="h-6 w-6 mr-2" />
//         <span>Upload Images</span>
//       </label>
//       <Input
//         type="file"
//         id="upload-input"
//         multiple
//         className="hidden"
//         {...register("images", { required:"At least one image is required",
//           validate: {
//             minImages: (value) => value.length >= 1,
//             maxImages: (value) => value.length <= 6,
//           }
//          })}
//         onChange={handleImageChange}
//       />
//       {errors?.images && (
//         <p className="text-red-500 mt-2">{errors.images.message}</p>
//       )}
//     </div>
//   )
// }