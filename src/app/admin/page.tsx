import { Button } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import PasswordInput from "@/components/Inputs/PasswordInput";
import Inputs from "@/components/Inputs/Inputs";

export default function LoginPage() {
  return (
    <>
      <div className="h-full w-full">
        <div className="p-5 h-full w-full items-center"></div>
      </div>
      <div className="h-full w-full flex flex-col md:flex-row justify-between">
        <div className="md:w-1/2 w-full p-10 m-2 ">
          <div className="p-10  ">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p>enter your credentials to access your acount</p>
          </div>

          <div className="px-6">
            <Inputs
              className="max-w-xs m-4"
              type="email"
              label="Email"
              variant="bordered"
              placeholder="Enter your email"
            />
            <PasswordInput label="Password"
             placeholder="Enter your password"
              className="max-w-xs m-4"
              />

            <div className="text-start ms-5 font-semibold">
              <Link href="#" className="text-sm hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="w-1/2 text-end my-3">
              <Button
                as={Link}
                className=" bg-red-700 text-black w-36"
                href="/login"
                variant="flat"
              >
                Sign in
              </Button>
            </div>
            <div className="flex items-start text-start p-4 text-sm">
              <div className="text-slate-500 font-semibold w-1/2 flex ">
                <FcGoogle className="m-1" />
                Sign in with Google
              </div>
              <div className="text-slate-500 font-semibold">
                Already have an account?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-red-600 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex justify-end items-end bg-cover bg-center w-ful rounded md:rounded-s-3xl md:w-1/2"
          style={{
            backgroundImage: `url('/images/gallery_8.jpg')`,
          }}
        >
          <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] w-full"></div>
        </div>
      </div>
    </>
  );
}
