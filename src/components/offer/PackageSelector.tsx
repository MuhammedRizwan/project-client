"use client";
import Package from "@/interfaces/package";
import { useEffect, useState } from "react";
import { Input, Card, CardBody, Button, Chip } from "@nextui-org/react";
import { UseFormSetValue } from "react-hook-form";
import Offer from "@/interfaces/offer";

interface PackageSelectorProps {
  packages: Package[];
  setValue: UseFormSetValue<Offer>;
  selectedPackage?: Package[]|string[];
}

export default function PackageSelector({
  packages,
  setValue,
  selectedPackage,
}: PackageSelectorProps) {
  // Ensure `selectedPackage` is only used if it is of type `Package[]`
  const initialSelectedPackages = Array.isArray(selectedPackage)
    ? selectedPackage
    : [];
console.log(initialSelectedPackages,"initialSelectedPackages")
  const [selectedPackages, setSelectedPackages] =
    useState<Package[]>((initialSelectedPackages as Package[]));
  const [inputValue, setInputValue] = useState(
    initialSelectedPackages.map((pack) => pack).join(", ")
  );

  // Update the selected packages in the form field
  useEffect(() => {
    const selectedPackageIds = selectedPackages.map((pack) => pack._id);
    setValue("package_id", (selectedPackageIds as string[]));
  }, [selectedPackages, setValue]);

  const handlePackageClick = (pack: Package) => {
    if (!selectedPackages.some((p) => p._id === pack._id)) {
      const updatedPackages = [...selectedPackages, pack];
      setSelectedPackages(updatedPackages);
      setInputValue(updatedPackages.map((p) => p.package_name).join(", "));
    }
  };

  const handleRemovePackage = (packToRemove: Package) => {
    const updatedPackages = selectedPackages.filter(
      (p) => p._id !== packToRemove._id
    );
    setSelectedPackages(updatedPackages);
    setInputValue(updatedPackages.map((p) => p.package_name).join(", "));
  };

  return (
    <>
      <Input
        type="hidden"
        value={inputValue}
        readOnly
        placeholder="Click on packages below to select"
        className="hidden"
      />
      <Card className="my-4">
        <CardBody className="p-4">
          <p className="text-sm font-semibold mb-2">Selected Packages:</p>
          {selectedPackages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedPackages.map((pack) => (
                <Chip
                  key={pack._id}
                  onClose={() => handleRemovePackage(pack)}
                  variant="flat"
                  color="primary"
                >
                  {pack.package_name}
                </Chip>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
      <Card className="my-4">
        <CardBody className="p-4">
          {packages && packages.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {packages.map((pack) => (
                <Button
                  key={pack._id}
                  size="sm"
                  color="primary"
                  variant={
                    selectedPackages.some((p) => p._id === pack._id)
                      ? "solid"
                      : "bordered"
                  }
                  onClick={() => handlePackageClick(pack)}
                >
                  {pack.package_name}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No Packages Available</p>
          )}
        </CardBody>
      </Card>
    </>
  );
}
