'use client'
import PackageForm, { PackageFormValues } from "@/components/package/PackageForm";

const EditPackagePage = () => {
  const existingPackageData: PackageFormValues = {
    packageName: "Holiday Package",
    category: "Luxury",
    maxPerson: 10,
    noOfDays: 5,
    noOfNights: 4,
    destination: "Maldives",
    price: 1200,
    activities: [
      { time: "09:00", activity: "Snorkeling" },
      { time: "12:00", activity: "Lunch" }
    ],
    images: ["/images/snorkeling.jpg", "/images/lunch.jpg"]
  };

  const handleEditPackage = (data: PackageFormValues) => {
    console.log("Package Updated", data);
  };

  return (
    <div>
      <h1>Edit Package</h1>
      <PackageForm 
        initialData={existingPackageData} 
        onSubmit={handleEditPackage}
        formTitle="Edit Package"
      />
    </div>
  );
};

export default EditPackagePage;
