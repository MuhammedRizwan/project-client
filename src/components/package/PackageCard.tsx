import Package from "@/interfaces/package";
import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import { User, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
export default function PackageCard({ packages }: { packages: Package[] }) {
  const router = useRouter();
  return (
    <>
      {packages.map((packageData: Package, index: number) => (
        <Card key={index} className="w-full">
          <CardBody className=" overflow-hidden p-3">
            <Image
              isZoomed
              src={packageData?.images[0]}
              alt={packageData.package_name}
              className="w-full h-[250px] object-cover"
            />
          </CardBody>
          <CardFooter className="flex flex-col items-start">
            <h3 className="text-lg font-semibold mb-2">
              {packageData.package_name}
            </h3>
            <div className="flex flex-wrap gap-2 w-full mb-4">
              {packageData.destinations.map(
                (destination: string, index: number) => (
                  <span
                    key={index}
                    className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                  >
                    {destination}
                  </span>
                )
              )}
            </div>
            <div className="flex justify-between w-full mb-2">
              <div className="flex items-center">
                <User size={16} className="mr-1" />
                <span className="text-sm">{packageData.max_person} Person</span>
              </div>
              <div className="flex items-center">
                <Sun size={16} className="mr-1" />
                <span className="text-sm">{packageData.no_of_days} Day</span>
              </div>
              <div className="flex items-center">
                <Moon size={16} className="mr-1" />
                <span className="text-sm">
                  {packageData.no_of_nights} Night
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <Button
                color="warning"
                onClick={() => router.push(`/packages/${packageData._id}`)}
              >
                Details
              </Button>
              <div className="text-right">
                <p className="text-sm text-gray-500">Start From</p>
                <p className="font-semibold">₹{packageData.offer_price}</p>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
