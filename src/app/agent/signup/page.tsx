"use client";
import { Button } from "@nextui-org/react";

import Link from "next/link";
import PasswordInput from "@/components/Inputs/PasswordInput";
import Inputs from "@/components/Inputs/Inputs";

export default function AgentSignupPage() {
  return (
    <>
      <div className="h-full w-full">
        <div className="p-5 h-full w-full items-center"></div>
      </div>
      <div className="h-full w-full flex flex-col md:flex-row justify-between">
        <div
          className="flex justify-end items-end bg-cover bg-center w-ful rounded md:rounded-e-3xl md:w-1/2"
          style={{
            backgroundImage: `url('/images/Apakunee-Falls-View.webp')`,
          }}
        >
          <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] w-full"></div>
        </div>
        <div className="md:w-1/2 w-full px-10 m-2 ">
          <div className="px-10  ">
            <h1 className="text-3xl font-bold">Get Started Now</h1>
            <p>Enter your information to move to the next world</p>
          </div>

          <div className="px-6">
            <Inputs
              size="sm"
              className="max-w-xs m-4"
              type="Username"
              label="text"
              placeholder="Type your username"
            />{" "}
            <Inputs
              className="max-w-xs m-4 "
              type="email"
              label="Email"
              placeholder="Type your email"
            />{" "}
            <Inputs
              className="max-w-xs m-4"
              type="text"
              label="Phone"
              placeholder="Type your phone"
            />
            <PasswordInput
              label="Password"
              placeholder="Type your password"
              className="max-w-xs m-4"
            />
            <PasswordInput
              label="Confirm password"
              placeholder="Type your confirm password"
              className="max-w-xs m-4"
            />
            <div className="text-start ms-5 text-sm">
              Already have an account?{" "}
              <Link
                href="/agent"
                className="font-bold text-red-600 hover:underline"
              >
                Sign in
              </Link>
            </div>
            {/* <div className="text-slate-500 font-semibold w-1/2 flex ">
              <FcGoogle className="m-1" />
              Sign in with Google
            </div> */}
            <div className="w-1/2 text-end my-3">
              <Button
                as={Link}
                className=" bg-red-700 text-black w-36"
                href="/agentHome"
                variant="flat"
              >
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
