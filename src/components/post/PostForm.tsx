"use client";

import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Textarea,

  Input,
  Image,
} from "@nextui-org/react";
import { ImageIcon, MapPin, Text, X } from "lucide-react";
import { Createpost } from "@/app/(user)/(profile)/user-post/add-post/page";
import User from "@/interfaces/user";
import Post from "@/interfaces/post";

interface postFormProps {
  user: User | null;
  onSubmit: (data: Createpost) => void;
  post?: Post | null;
}

export default function PostForm({ user, onSubmit, post }: postFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<Createpost>({
    defaultValues: {
      user_id: user?._id,
      images: [],
      caption: post?.caption || "",
      location: post?.location || "",
    },
  });
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("File must be an image!");
        return;
      }
      setValue("images", [...getValues("images"), file]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = getValues("images");
    const updatedImages = currentImages.filter((_, i) => i !== index);
    setValue("images", updatedImages);
  };
  return (
    <Card className="w-full mx-3">
      <CardBody className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Avatar
              src={user?.profile_picture as string}
              alt="User Avatar"
              className="mr-3"
            />
            <div>
              <h3 className="font-semibold">{user?.username}</h3>
            </div>
          </div>
          <Button isIconOnly variant="light">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <Controller
              name="images"
              control={control}
              render={({ field }) => (
                <>
                  {field.value.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={URL.createObjectURL(image)}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Button
                        isIconOnly
                        color="danger"
                        variant="solid"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {field.value.length < 4 && (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </>
              )}
            />
            {errors.images && (
              <p className="text-red-500 text-sm">
                At least one image is required.
              </p>
            )}
          </div>

          <Textarea
            label="caption"
            placeholder="Write a caption..."
            startContent={<Text className="text-default-300" />}
            {...register("caption", {
              required: "Caption is required.",
              minLength: {
                value: 10,
                message: "Caption must be at least 10 characters long.",
              },
              maxLength: {
                value: 200,
                message: "Caption cannot be 200 characters long.",
              },
            })}
          />
          <p className="text-red-500 text-xs h-[20px]">
            {errors.caption?.message}
          </p>

          <Input
            label="location"
            placeholder="Add location"
            {...register("location", {
              required: "Location is required.",
              minLength: {
                value: 3,
                message: "Location must be at least 3 characters long.",
              },
              maxLength: {
                value: 50,
                message: "Location cannot exceed 50 characters.",
              },
            })}
            startContent={<MapPin className="text-default-300" />}
          />
          <p className="text-red-500 text-xs h-[20px]">
            {errors.location?.message}
          </p>

          <div className="flex justify-end">
            <Button type="submit" color="primary">
              Post
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
