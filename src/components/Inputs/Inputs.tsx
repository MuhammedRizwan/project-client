'use client'
import { Input, InputProps, MergeWithAs } from "@nextui-org/react";
import { JSX, DetailedHTMLProps, InputHTMLAttributes } from "react";


export default function Inputs(props: JSX.IntrinsicAttributes & MergeWithAs<Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, Omit<Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, never>, InputProps, "input">){
    return(
        <Input
        isClearable
         variant="bordered"
        onClear={() => console.log("input cleared")}
        {...props}
      />
    )
}