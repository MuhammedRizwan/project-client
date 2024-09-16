'use client'
import { DetailedHTMLProps, InputHTMLAttributes, JSX, useState } from "react";
import { EyeSlashFilledIcon } from "../icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../icons/EyeFilledIcon";
import { Input, InputProps, MergeWithAs } from "@nextui-org/react";

export default function PasswordInput(props: JSX.IntrinsicAttributes & MergeWithAs<Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, Omit<Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, never>, InputProps, "input">){
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    return(
        <Input
        variant="bordered"
        {...props}
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
      />
    )
}