"use client";
import Package from "@/interfaces/package";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PackageTable from "@/components/package/PackageTable";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { fetch_agent_package, block_package } from "@/config/agent/packageservice";
import BlockModal from "@/components/modal/blockModal";

export default function Packages() {
  const { agent } = useAppSelector((state: RootState) => state.agent);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
   const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        if (!agent?._id) {
          setError("Agent ID is missing");
          setLoading(false);
          return;
        }
        const response = await fetch_agent_package(agent._id,searchTerm,currentPage,itemsPerPage);
        if (response.success) {
        const { packages,totalPages } = response;
          setPackages(packages);
          setTotalPages(totalPages)
        } else {
          toast.error("Invalid data format from backend");
        }
      } catch (error) {
        setError("Error fetching packages");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [agent, currentPage, searchTerm]);

  const handleBlockClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (selectedPackage) {
      try {
        const newStatus = !selectedPackage.is_block;
        const response = await block_package(selectedPackage._id,{is_block: newStatus});
        if (response.success) {
          toast.success(`Package ${selectedPackage.package_name} has been blocked.`);
          const {Package}=response
          setPackages((prevPackages) =>
            prevPackages.map((p) =>
              p._id === selectedPackage._id ? Package : p
            )
          );
          setIsModalOpen(false);
        } else {
          toast.error("Failed to block the package.");
        }
      } catch (error) {
        if(axios.isAxiosError(error)){
          toast.error(error.response?.data.message);
        }else{
          toast.error("Failed to block the package.");
        }
      }
    }
  };
  const handleCurrentPage=(page:number)=>{
    setCurrentPage(page)
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <PackageTable
        data={packages}
        onBlock={handleBlockClick}
        setSearchTerm={setSearchTerm}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={handleCurrentPage}
      />
      {isModalOpen && selectedPackage && (
        <BlockModal
          title={`Block Package: ${selectedPackage.package_name}`}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmBlock}
        >
          <p>Are you sure you want to block this package?</p>
        </BlockModal>
      )}
    </>
  );
}
