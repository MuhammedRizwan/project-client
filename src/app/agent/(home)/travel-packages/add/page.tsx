'use client'
import PackageForm, { PackageFormValues } from "@/components/package/PackageForm";


const AddPackagePage = () => {
  const handleAddPackage = (data: PackageFormValues) => {
    console.log("Package Added", data);
  };

  return (
    <div>
      <h1>Add New Package</h1>
      <PackageForm 
        initialData={undefined}
        categories={[]}
        onSubmit={handleAddPackage}
        formTitle="Add Package"
      />
    </div>
  );
};

export default AddPackagePage;
