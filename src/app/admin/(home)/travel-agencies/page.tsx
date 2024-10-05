"use client";
import BlockModal from "@/components/modal/blockModal";
import Table from "@/components/Table";
import { Agent } from "@/interfaces/agent";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TravelAgencies() {
  const router = useRouter();
  const [agent, setAgent] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
            agent.is_block ? "bg-green-500" : "bg-red-500"
          } text-white rounded w-20`}
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
          className={`px-4 py-2 w-32 bg-yellow-700 text-white rounded`}
        >
          view details
        </button>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/travel-agencies"
        );
        const {agencies}=response.data
        setAgent(agencies);
      } catch (error) {
        setError("Error fetching users");
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

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  const handleBlockClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowModal(true);
  };
  const confirmBlockUser = async () => {
    if (selectedAgent) {
      try {
        const newStatus = !selectedAgent.is_block;
        const res = await axios.patch(
          "http://localhost:5000/admin/travel-agencies/block",
          { id: selectedAgent._id, is_block: newStatus }
        );
        if (res.status === 200) {
          const updatedAgent = res.data.agent;
          toast.success(res.data.message)

          setAgent((prevAgent) =>
            prevAgent.map((agent) =>
              agent._id === updatedAgent._id ? updatedAgent : agent
            )
          );
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

  return (
    <div>
      <Table columns={agentColumns} data={agent} />
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
  );
}
