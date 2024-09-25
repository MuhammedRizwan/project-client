import { Button } from "@nextui-org/react";
import Logo from "../Logo";
import { IoSendSharp } from "react-icons/io5";

export default function Footer() {
  return (
    <div className=" bg-gray-100 pt-10">
      <div className=" bg-gray-700">
        <div className="w-full h-full flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-black py-6 flex md:flex-col justify-center items-center me-40">
            <div className="px-6 text-2xl  text-white font-extrabold font-serif">
              <h1>If you have any question,</h1>
              <h1>Let us help you!</h1>
            </div>
            <div className="w-full py-10 flex justify-center items-center ms-16">
              <input className="max-w-xs" />
              <div className="m-1 p-4  bg-yellow-700 rounded-lg z-10 hover:bg-yellow-600">
                <IoSendSharp className="text-white" />
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 py-10  ">
            <div className="flex justify-start  ">
              <Logo />
              <p className="text-center text- text-white font-serif text-inherit mt-6">
                HEAVEN FINDER
              </p>
            </div>
            <div className="py-7 me-20">
              <h6 className="text-white">
                Embark on your next adventure with us—your ultimate travel
                companion for unforgettable journeys!
              </h6>
            </div>
            <div className="grid grid-cols-3 gap-4 font-serif">
              <div className="hover:cursor-pointer">
                <h3 className="text-white hover:text-yellow-600 me-24">Home</h3>
              </div>
              <div className="hover:cursor-pointer">
                <h3 className="text-white hover:text-yellow-600 me-24">
                  Packages
                </h3>
              </div>
              <div className="hover:cursor-pointer">
                <h3 className="text-white hover:text-yellow-600 me-24">Blog</h3>
              </div>
              <div className="hover:cursor-pointer">
                <h3 className="text-white hover:text-yellow-600 me-24">
                  Contacts
                </h3>
              </div>
              <div className="hover:cursor-pointer">
                <h3 className="text-white hover:text-yellow-600 me-24">
                  Booking
                </h3>
              </div>
            </div>

            <div className="py-10">
              <Button className=" text-yellow-600">
                Login As Travel agent
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
