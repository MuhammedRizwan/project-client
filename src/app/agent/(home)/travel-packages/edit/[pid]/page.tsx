'use client'
import PackageForm, { PackageFormValues } from "@/components/package/PackageForm";

const EditPackagePage = () => {
  const examplePackage: PackageFormValues = {
    package_name: "Tropical Island Adventure",
    category: [
  
    ],
    max_person: 6,
    no_of_days: 5,
    no_of_nights: 4,
    destinations: ["Bora Bora", "Tahiti", "Moorea"],
    original_price: 2999.99,
    itineraries: [
      {
        day: 1,
        activities: [
          { time: "08:00 AM", activity: "Arrival and check-in" },
          { time: "10:00 AM", activity: "Beach exploration" },
          { time: "02:00 PM", activity: "Snorkeling" }
        ]
      },
      {
        day: 2,
        activities: [
          { time: "09:00 AM", activity: "Island hiking" },
          { time: "01:00 PM", activity: "Lunch at local restaurant" },
          { time: "03:00 PM", activity: "Scuba diving" }
        ]
      },
      {
        day: 3,
        activities: [
          { time: "07:00 AM", activity: "Sunrise yoga" },
          { time: "10:00 AM", activity: "Boat tour" },
          { time: "05:00 PM", activity: "Evening bonfire" }
        ]
      },
      {
        day: 4,
        activities: [
          { time: "10:00 AM", activity: "Relaxing on the beach" },
          { time: "01:00 PM", activity: "Cultural village tour" }
        ]
      },
      {
        day: 5,
        activities: [
          { time: "08:00 AM", activity: "Pack and checkout" },
          { time: "10:00 AM", activity: "Departure" }
        ]
      }
    ],
    images: [
      // Mock file objects, you would typically use real File objects in a form
      new File([""], "beach.jpg", { type: "image/jpeg" }),
      new File([""], "scuba.jpg", { type: "image/jpeg" })
    ]
  };
  

  const handleEditPackage = (data: PackageFormValues) => {
    console.log("Package Updated", data);
  };

  return (
    <div>
      <h1>Edit Package</h1>
      <PackageForm 
        initialData={examplePackage} 
        categories={[]}
        onSubmit={handleEditPackage}
        formTitle="Edit Package"
      />
    </div>
  );
};

export default EditPackagePage;
