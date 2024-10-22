/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import BlockModal from "@/components/modal/blockModal";
import Table from "@/components/Table";
import User from "@/interfaces/user";
import axiosInstance from "@/lib/axiosInstence";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function userList() {
  const [, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const userColumns: {
    key: keyof User;
    label: string;
    render?: (user: User) => React.ReactNode;
  }[] = [
    { key: "username", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "is_verified",
      label: "verification",
      render: (user: User) => (
        <p className={user.is_verified ? "text-red-600" : "text-green-600"}>
          {user.is_verified ? "verified" : "not verified"}
        </p>
      ),
    },
    {
      key: "is_block",
      label: "Block/Unblock",
      render: (user: User) => (
        <Button
          onClick={() => handleBlockClick(user)}
          className={`px-4 py-2 ${
            user.is_block ? "bg-green-500" : "bg-red-500"
          } text-white rounded w-20`}
        >
          {user.is_block ? "Unblock" : "Block"}
        </Button>
      ),
    },
  ];

  if (error) return <div>{error}</div>;
  const handleBlockClick = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };
  const confirmBlockUser = async () => {
    if (selectedUser) {
      try {
        const newStatus = !selectedUser.is_block;
        const res = await axiosInstance.patch("/user/block", {
          id: selectedUser._id,
          is_block: newStatus,
        });
        if (res.status === 200) {
          const updatedUser = res.data.user;
          toast.success(res.data.message);
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
const apiUrl="/users"
  return (
    <div>
      <Table<User> columns={userColumns} apiUrl={apiUrl}/>
      {showModal && selectedUser && (
        <BlockModal
          title="Confirm Block/Unblock"
          onClose={() => setShowModal(false)}
          onConfirm={confirmBlockUser}
        >
          <p>
            Are you sure you want to{" "}
            {selectedUser.is_block ? "unblock" : "block"}{" "}
            {selectedUser.username}?
          </p>
        </BlockModal>
      )}
    </div>
  );
}
