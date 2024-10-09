"use client";
// import BlockModal from "@/components/modal/blockModal";
import Package from "@/interfaces/package";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
import PackageTable from "@/components/package/PackageTable";

export default function Packages() {
  // const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  // const [showModal, setShowModal] = useState<boolean>(false);

  // const packageColumns: {
  //   key: keyof PackageData;
  //   label: string;
  //   render?: (packageData: PackageData) => React.ReactNode;
  // }[] = [
  //   { key: "package_name", label: "Name" },
  //   { key: "destinations", label: "Destinations" },
  //   { key: "original_price", label: "Original Price" },
  //   { key: "offer_price", label: "Offer Price" },
  //   {
  //     key: "is_block",
  //     label: "Action",
  //     render: (packageData: PackageData) => (
  //       <button
  //         onClick={() => handleBlockClick(packageData)}
  //         className={`px-4 py-2 ${packageData.is_block ? "bg-green-500" : "bg-red-500"} text-white rounded w-20`}
  //       >
  //         {packageData.is_block ? "Unblock" : "Block"}
  //       </button>
  //     ),
  //   },
  //   {
  //     key: "package_name",
  //     label: "View Details",
  //     render: (packageData: PackageData) => (
  //       <button
  //         onClick={() => viewDetailsClick(packageData)}
  //         className="px-4 py-2 w-32 bg-yellow-700 text-white rounded"
  //       >
  //         View Details
  //       </button>
  //     ),
  //   },
  // ];

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/agent/package");
        const { packageList } = response.data;
        if (packageList && Array.isArray(packageList)) {
          setPackages(packageList); // Set the fetched data to the state
        } else {
          toast.error("Invalid data format from backend");
        }
      } catch (error) {
        setError("Error fetching packages");
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data || "Fetching Failed";
          toast.error(errorMessage.message);
        } else {
          toast.error("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // const handleBlockClick = (packageData: PackageData) => {
  //   setSelectedPackage(packageData);
  //   setShowModal(true);
  // };

  // const confirmBlockPackage = async () => {
  //   if (selectedPackage) {
  //     try {
  //       const newStatus = !selectedPackage.is_block;
  //       const res = await axios.patch("http://localhost:5000/agent/package/block", {
  //         package_name: selectedPackage.package_name,
  //         is_block: newStatus,
  //       });
  //       if (res.status === 200) {
  //         const updatedPackage = res.data.package;
  //         toast.success(res.data.message);

  //         setPackages((prevPackages) =>
  //           prevPackages.map((pkg) => (pkg.package_name === updatedPackage.package_name ? updatedPackage : pkg))
  //         );
  //       }
  //     } catch (error) {
  //       setError("Error updating package");
  //       if (axios.isAxiosError(error)) {
  //         const errorMessage = error.response?.data || "Action failed";
  //         toast.error(errorMessage.message);
  //       } else {
  //         toast.error("An unknown error occurred");
  //       }
  //     } finally {
  //       setShowModal(false);
  //     }
  //   }
  // };

  // const viewDetailsClick = (packageData: PackageData) => {
  //   router.push(`/agent/packages/${packageData.package_name}`);
  // };
  console.log(packages);
  

  return (
    <div>
  
  
  <PackageTable data={packages} />

      {/* {showModal && selectedPackage && (
        <BlockModal
          title="Confirm Block/Unblock"
          onClose={() => setShowModal(false)}
          onConfirm={confirmBlockPackage}
        >
          <p>
            Are you sure you want to {selectedPackage.is_block ? "unblock" : "block"}{" "}
            {selectedPackage.package_name}?
          </p>
        </BlockModal>
      )} */}
    </div>
  );
}
