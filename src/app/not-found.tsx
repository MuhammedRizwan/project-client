'use client'
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-6xl font-bold mb-4 text-orange-500">404</h1>
      <h2 className="text-3xl mb-8">Page Not Found</h2>
      <p className="text-xl mb-8 text-center max-w-md">
        {`Oops! The page you're looking for doesn't exist or has been moved.`}
      </p>
      <Button  
        variant="shadow"
        size="lg"
        className="bg-orange-500"
        onClick={() => router.back()}
      >
        Go Back
      </Button>
    </div>
  );
}