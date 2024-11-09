// PersonalInfoForm.js
"use client";
import React, { useState, useRef } from "react";
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Image,
} from "@nextui-org/react";
import { ChevronDown, Edit } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import User from "@/interfaces/user";

interface PersonalInfoFormProps {
  user: User;
  onSubmit: (data: User) => void;
}

export default function PersonalInfoForm({
  user,
  onSubmit,
}: PersonalInfoFormProps) {
  const [image, setImage] = useState<string>(user.profile_picture || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    defaultValues: user,
  });

  const onSubmitPersonalInfo: SubmitHandler<User> = (data) => {
    onSubmit({ ...data, profile_picture: image });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitPersonalInfo)}
      className="bg-white rounded-lg shadow p-6 mb-8"
    >
      <div className="relative flex flex-col items-center mb-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200">
          {image ? (
            <Image
              src={image}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-gray-500 flex items-center justify-center h-full">
              No Image
            </span>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md"
          >
            <Edit size={20} className="text-gray-600" />
          </button>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
        />
      </div>
      <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            {...register("username", {
              required: "First Name is required",
              maxLength: {
                value: 50,
                message: "First name cannot exceed 50 characters",
              },
              pattern: {
                value: /^(?! )[a-zA-Z\s.]+$/,
                message:
                  "Only letters, spaces, and periods are allowed, no leading spaces",
              },
            })}
            label="First Name"
            placeholder="Enter your first name"
            isInvalid={!!errors.username}
          />
          <span className="text-xs text-red-500 h-[20px]">
            {errors.username?.message || " "}
          </span>
        </div>
        <div>
          <Input
            {...register("lastname", {
              required: "Last Name is required",
              maxLength: {
                value: 50,
                message: "Last name cannot exceed 50 characters",
              },
              pattern: {
                value: /^(?! )[a-zA-Z\s.]+$/,
                message:
                  "Only letters, spaces, and periods are allowed, no leading spaces",
              },
            })}
            label="Last Name"
            placeholder="Enter your last name"
            isInvalid={!!errors.lastname}
          />
          <span className="text-xs text-red-500 h-[20px]">
            {errors.lastname?.message || " "}
          </span>
        </div>
        <div>
          <Input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            label="Email Address"
            placeholder="Enter your email address"
            isInvalid={!!errors.email}
            className="md:col-span-2"
          />
             <span className="text-xs text-red-500 h-[20px]">
            {errors.email?.message || " "}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" className="w-20 h-14">
                +91 <ChevronDown size={16} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Country codes">
              <DropdownItem key="1">+1</DropdownItem>
              <DropdownItem key="44">+44</DropdownItem>
              <DropdownItem key="91">+91</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Input
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Phone number must be exactly 10 digits",
              },
            })}
            label="Phone Number"
            placeholder="Enter your phone number"
            isInvalid={!!errors.phone}
            className="flex-grow"
          />
           <span className="text-xs text-red-500 h-[20px]">
            {errors.phone?.message || " "}
          </span>
        </div>
        <div>
          <Input
            {...register("address", {
              maxLength: {
                value: 150,
                message: "Address cannot exceed 150 characters",
              },
              minLength: {
                value: 5,
                message: "Address must be at least 5 characters",
              },
            })}
            label="Address"
            placeholder="Enter your address"
            isInvalid={!!errors.address}
            className="md:col-span-2"
          />
            <span className="text-xs text-red-500 h-[20px]">
            {errors.address?.message || " "}
          </span>
        </div>
      </div>
      <Button type="submit" color="primary" className="mt-4">
        Save Personal Info
      </Button>
    </form>
  );
}
