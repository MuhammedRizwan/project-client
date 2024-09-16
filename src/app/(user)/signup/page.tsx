import SignupForm from "@/components/user/forms/SignupForm";

export default function SignupPage() {
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
        <div className="md:w-1/2 w-full px-10 ">
          <div className="px-10">
            <h1 className="text-3xl font-bold">Get Started Now</h1>
            <p>Enter your information to move to the next world</p>
          </div>
          {/* Use the SignupForm component here */}
          <SignupForm />
        </div>
      </div>
    </>
  );
}
