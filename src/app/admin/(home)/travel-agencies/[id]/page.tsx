"use client";
import Agent from "@/interfaces/agent";
import axios from "axios";
import React, { useEffect, useState } from "react";
import BlockModal from "@/components/modal/blockModal";
import toast from "react-hot-toast";

import { agent_data, block_agent, verify_agent } from "@/config/admin/authservice";
import { Image } from "@nextui-org/react";
import { useSocket } from "@/components/context/socketContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ProfileCard({ params }: { params: { id: string } }) {
  const {socket}=useSocket();
  const admin=useSelector((state:RootState)=>state.admin.admin)
  const [agent, setAgent] = useState<Agent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await agent_data(params.id)
        setAgent(response.agent);
      } catch (error) {
        setError("Error fetching agent details");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const toggleBlockStatus = async () => {
    try {
      const response = await block_agent({
        id: params.id,
        is_block: !isBlocked,
      });
      if (response.success) {
        setIsBlocked((prev) => !prev);
        toast.success(response.message);
      }
    } catch (error) {
      setError("Error updating block status");
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || "Action Failed";
        toast.error(errorMessage.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setShowModal(false);
    }
  };

  const handleBlockClick = () => {
    setShowModal(true);
  };

  const handleAccept = async () => {
    try {
      const response = await verify_agent({id: params.id,admin_verified: "accept"})
      if (response.success) {
        const agent=response.agent
        if (socket) {
          const Notification = {
            heading:"Agent Confirmed",
            message: `Hi ${agent.agency_name}, Welcome to the Heaven Finder.`,
            from: admin?._id,
            fromModel: "Admin",
            to: agent._id,
            toModel: "Agent",
          };
          socket.emit("to-the-agent", Notification);
        }
        toast.success(response.message);

        setAgent((prev) => prev && { ...prev, admin_verified: "accept" });
      }
    } catch (error) {
      setError("Error accepting agent");
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || "Action Failed";
        toast.error(errorMessage.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsReadOnly(true);
    }
  };

  const handleReject = async () => {
    try {
      const response = await verify_agent({id: params.id,admin_verified: "reject"} );
      if (response.success) {
        toast.success(response.message);
        setAgent((prev) => prev && { ...prev, admin_verified: "reject" });
      }
    } catch (error) {
      setError("Error accepting agent");
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || "Action Failed";
        toast.error(errorMessage.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsReadOnly(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const documentUrl = agent?.DocumentURL;
  const isImage = documentUrl?.includes("/image/");
  const isPDF = documentUrl?.includes("/raw/");

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg grid gap-8 sm:grid-cols-1 md:grid-cols-2">
      <div>
        <div className="mb-4">
          <span className="font-semibold">Name</span>
          <input
            type="text"
            value={agent?.agency_name || ""}
            className="block w-full bg-gray-100 border-none rounded px-4 py-2 mt-2 shadow"
            readOnly={isReadOnly}
          />
        </div>
        <div className="mb-4">
          <span className="font-semibold">Email</span>
          <input
            type="text"
            value={agent?.email || ""}
            className="block w-full bg-gray-100 border-none rounded px-4 py-2 mt-2 shadow"
            readOnly={isReadOnly}
          />
        </div>
        <div className="mb-4">
          <span className="font-semibold">Location</span>
          <input
            type="text"
            value={agent?.location || ""}
            className="block w-full bg-gray-100 border-none rounded px-4 py-2 mt-2 shadow"
            readOnly={isReadOnly}
          />
        </div>
        <div className="mb-4">
          <span className="font-semibold">Phone</span>
          <input
            type="text"
            value={agent?.phone || ""}
            className="block w-full bg-gray-100 border-none rounded px-4 py-2 mt-2 shadow"
            readOnly={isReadOnly}
          />
        </div>
      </div>

      <div className="flex flex-col items-center">
        {documentUrl && isImage && (
          <Image
            src={documentUrl}
            alt="Uploaded Image"
            className="w-32 h-32 rounded-lg shadow mb-4"
          />
        )}
        {documentUrl && isPDF && (
          <div className="flex flex-col items-center mb-4">
            <span className="font-semibold">PDF Document</span>
            <a href={documentUrl} target="_blank" rel="noopener noreferrer">
              <div className="text-6xl text-blue-600 mt-2">📄</div>
            </a>
          </div>
        )}

        <div className="flex items-center justify-center mb-4">
          <h1 className="font-semibold me-2">Travel Agency Status:</h1>
          <button
            onClick={handleBlockClick}
            className={`px-4 py-2 rounded-md shadow ${
              isBlocked
                ? "bg-red-200 text-red-700"
                : "bg-green-200 text-green-700"
            }`}
          >
            {isBlocked ? "Unblock" : "Block"}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <h1 className="font-semibold me-2">Confirm:</h1>
          {agent?.admin_verified === "pending" ? (
            <>
              <button
                onClick={handleAccept}
                className="bg-green-200 text-green-700 px-4 py-2 rounded-md shadow"
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                className="bg-red-200 text-red-700 px-4 py-2 rounded-md shadow"
              >
                Reject
              </button>
            </>
          ) : (
            <h3
              className={`font-serif font-semibold ${
                agent?.admin_verified === "accept"
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {agent?.admin_verified === "accept" ? "Accepted" : "Rejected"}
            </h3>
          )}
        </div>
      </div>

      {showModal && (
        <BlockModal
          title={isBlocked ? "Unblock Agency" : "Block Agency"}
          onClose={() => setShowModal(false)}
          onConfirm={toggleBlockStatus}
        >
          <p>
            Are you sure you want to {isBlocked ? "unblock" : "block"} this
            agency?
          </p>
        </BlockModal>
      )}
    </div>
  );
}
