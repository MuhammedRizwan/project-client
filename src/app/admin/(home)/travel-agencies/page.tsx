"use client";
import { block_agent } from "@/config/admin/authservice";
import BlockModal from "@/components/modal/blockModal";
import Table from "@/components/Table";
import Agent from "@/interfaces/agent";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function TravelAgencies() {
  const router = useRouter();
  const [agent, setAgent] = useState<Agent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const agentColumns: {
    key: keyof Agent;
    label: string;
    render?: (agent: Agent) => React.ReactNode;
  }[] = [
    { key: "agency_name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "is_verified",
      label: "verification",
      render: (agent: Agent) => (
        <p className={agent.is_verified ? "text-red-600" : "text-green-600"}>
          {agent.is_verified ? "verified" : "not verified"}
        </p>
      ),
    },
    {
      key: "is_block",
      label: "Action",
      render: (agent: Agent) => (
        <button
          onClick={() => handleBlockClick(agent)}
          className={`px-4 py-2 ${
            agent.is_block ? "bg-green-500" : "bg-red-600"
          } text-black rounded w-20`}
        >
          {agent.is_block ? "Unblock" : "Block"}
        </button>
      ),
    },
    {
      key: "_id",
      label: "view detials",
      render: (agent: Agent) => (
        <button
          onClick={() => viewDetialsClick(agent)}
          className={`px-4 py-2 w-32 bg-zinc-900 text-white rounded`}
        >
          view details
        </button>
      ),
    },
  ];

  if (error) return <div>{error}</div>;
  const handleBlockClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowModal(true);
  };
  const confirmBlockUser = async () => {
    if (selectedAgent) {
      try {
        const newStatus = !selectedAgent.is_block;
        const response = await block_agent({
          id: selectedAgent._id,
          is_block: newStatus,
        });
        if (response.success) {
          const updatedAgent=response.agent
          setAgent((prevAgent) =>
            prevAgent.map((agent) =>
              agent._id === updatedAgent._id ? updatedAgent : agent
            )
          );
          toast.success(response.message);
        }
      } catch (error) {
        setError("Error fetching users");
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data || "Action failed";
          toast.error(errorMessage.message);
        } else {
          toast.error("An unknown error occurred");
        }
      } finally {
        setShowModal(false);
      }
    }
  };
  const viewDetialsClick = (agent: Agent) => {
    router.push(`/admin/travel-agencies/${agent._id}`);
  };
  const apiUrl = "/travel-agencies";
  return (
    <div className="p-6 md:p-1 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-700 mb-6">
          Agency List
        </h1>
        <Table<Agent> columns={agentColumns} apiUrl={apiUrl} data={agent} setData={setAgent} />
        {showModal && selectedAgent && (
          <BlockModal
            title="Confirm Block/Unblock"
            onClose={() => setShowModal(false)}
            onConfirm={confirmBlockUser}
          >
            <p>
              Are you sure you want to{" "}
              {selectedAgent.is_block ? "unblock" : "block"}{" "}
              {selectedAgent.agency_name}?
            </p>
          </BlockModal>
        )}
      </div>
    </div>
  );
}
