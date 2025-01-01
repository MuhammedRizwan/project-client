/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { block_user } from "@/config/admin/authservice";
import BlockModal from "@/components/modal/blockModal";
import Table from "@/components/Table";
import User from "@/interfaces/user";
import { Button, Image } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function userList() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const userColumns: {
    key: keyof User;
    label: string;
    render?: (user: User) => React.ReactNode;
  }[] = [
    {
      key: "profile_picture",
      label: "Profile",
      render: (user: User) => (
        <div className="flex justify-center items-center">
          <Image
            src={user.profile_picture as string || "/logos/avatar.avif"}
            alt="Category"
            width={50}
            height={50}
            className="h-16 w-16 md:h-12 md:w-12 rounded-full object-cover border border-gray-200 shadow-sm"
          />
        </div>
      ),
    },
    { key: "username", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "is_verified",
      label: "Verification",
      render: (user: User) => (
        <p
          className={`text-sm font-semibold ${
            user.is_verified ? "text-green-600" : "text-red-600"
          }`}
        >
          {user.is_verified ? "Verified" : "Not Verified"}
        </p>
      ),
    },
    {
      key: "is_block",
      label: "Block/Unblock",
      render: (user: User) => (
        <Button
          onClick={() => handleBlockClick(user)}
          className={`w-24 text-sm ${
            user.is_block ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
          } text-white rounded`}
        >
          {user.is_block ? "Unblock" : "Block"}
        </Button>
      ),
    },
  ];

  if (error)
    return <div className="text-center text-red-500 font-semibold">{error}</div>;

  const handleBlockClick = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const confirmBlockUser = async () => {
    if (selectedUser) {
      try {
        const newStatus = !selectedUser.is_block;
        const response = await block_user({ id: selectedUser._id, is_block: newStatus });
        if (response.success) {
          const updatedUser = response.user;
          toast.success(response.message);
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === updatedUser._id ? updatedUser : user
            )
          );
        }
      } catch (error) {
        setError("Error fetching users");
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data || "Action Failed";
          toast.error(errorMessage.message);
        } else {
          toast.error("An unknown error occurred");
        }
      } finally {
        setShowModal(false);
      }
    }
  };

  const apiUrl = "/users";

  return (
    <div className="p-6 md:p-1 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-700 mb-6">
          User List
        </h1>
        <Table<User> columns={userColumns} apiUrl={apiUrl} data={users} setData={setUsers} />
        {showModal && selectedUser && (
          <BlockModal
            title="Confirm Block/Unblock"
            onClose={() => setShowModal(false)}
            onConfirm={confirmBlockUser}
          >
            <p className="text-sm text-gray-700">
              Are you sure you want to{" "}
              <span className="font-bold">
                {selectedUser.is_block ? "unblock" : "block"}
              </span>{" "}
              {selectedUser.username}?
            </p>
          </BlockModal>
        )}
      </div>
    </div>
  );
}
