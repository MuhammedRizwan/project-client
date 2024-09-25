'use client'
import AgentOTPInputs from "@/components/agent/forms/agentOTPForm";
import useAgentAuthRedirect from "@/hooks/useAgentAuthRedirect";
// import useAuthRedirect from "@/hooks/useAuthRedirect";

export default function VerificationPage() {
useAgentAuthRedirect()
  return (
    <div className="bg-gray-100">
      <div className="h-full w-full">
        <div className="p-5 h-full w-full items-center"></div>
      </div>
      <div className="h-full w-full flex flex-col md:flex-row justify-between">
        <div className="md:w-1/2 w-full p-20 m-4 ">
          <div className="my-4">
            <h1 className="text-3xl font-bold">OTP Verification</h1>
            <p>enter the otp to confirm you</p>
          </div>
          <AgentOTPInputs />
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