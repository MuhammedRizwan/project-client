'use client'
import { EyeFilledIcon } from "@/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/icons/EyeSlashFilledIcon";
import { Input } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
    const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <>
      <div className="h-full w-full">
        <div className="p-5 h-full w-full items-center"></div>
      </div>
      <div className="h-full w-full flex flex-col md:flex-row justify-between">
        <div className="md:w-1/2 w-full p-7 bg-yellow-500 m-2">
          <div>
            <h1>Welcome Back</h1>
            <p>enter your credentials to access your acount</p>
          </div>
          <div className="p-6 ">
            <Input
              isClearable
              type="email"
              label="Email"
              variant="underlined"
              placeholder="Enter your email"
              onClear={() => console.log("input cleared")}
              className="max-w-xs py-5"
              isRequired
            />
            <Input
            isRequired
              label="Password"
              variant="underlined"
              placeholder="Enter your password"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="max-w-xs"
            />
          </div>
        </div>

        <div className="flex justify-end items-end min-w-56">
          <Image
            width={600}
            height={650}
            alt="NextUI hero Image with delay"
            src="/images/gallery_8.jpg"
            className="md:object-cover md:rounded-s-3xl w-full"
          />
        </div>
      </div>
    </>
  );
}
