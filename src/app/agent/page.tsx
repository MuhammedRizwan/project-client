'use client'
import AgentLoginForm from "@/components/agent/forms/AgentLoginForm";
import useAgent from "@/hooks/useAgent";

export default function AgentLoginPage() {
  useAgent()
  return (
    <div className=" bg-gray-100">
      <div className="h-full w-full">
        <div className="p-5 h-full w-full items-center"></div>
      </div>
      <div className="h-full w-full flex flex-col md:flex-row justify-between">
        <div className="md:w-1/2 w-full p-10 m-2 ">
          {" "}
          <AgentLoginForm />
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
    </div>
  );
}
