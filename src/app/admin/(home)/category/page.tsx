"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import BlockModal from "@/components/modal/blockModal";
import CategoryModal, {
  CategoryFormValues,
} from "@/components/modal/CategoryModal";
import Table, { TableColumn } from "@/components/Table";
import Image from "next/image";
import Category from "@/interfaces/category";
import { Button } from "@nextui-org/react";
import {
  add_category,
  block_category,
  edit_category,
} from "@/config/admin/categoryservice";
import axios from "axios";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useSocket } from "@/components/context/socketContext";

export default function Categories() {
  const { socket } = useSocket();
  const admin = useSelector((state: RootState) => state.admin.admin);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAddCategoryModal, setShowAddCategoryModal] =
    useState<boolean>(false);
  const [showEditCategoryModal, setShowEditCategoryModal] =
    useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const addCategory = () => {
    setShowAddCategoryModal(true);
  };

  const handleAddCategory = async (data: CategoryFormValues) => {
    try {
      setButtonLoading(true);
      const response = await add_category(data);
      if (response.success) {
        if (socket) {
          const Notification = {
            heading: "New Category Added",
            message: `We added a new category: ${response.category?.category_name}.`,
            from: admin?._id,
            fromModel: "Admin",
            toModel: "Agent",
          };
          socket.emit("to-agents", Notification);
        }
        console.log(response.category,"new category")
        setCategories([response.category,...categories]);

        toast.success("Category added successfully");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Failed to add category");
      }
    } finally {
      setShowAddCategoryModal(false);
      setButtonLoading(false);
    }
  };

  const handleEditCategory = async (data: CategoryFormValues) => {
    if (!selectedCategory) return;
    try {
      setButtonLoading(true);
      const response = await edit_category(selectedCategory._id, data);
      if (response.success) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === response.category._id ? response.category : cat
          )
        );
        toast.success("Category updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update category");
    } finally {
      setButtonLoading(false);
      setShowEditCategoryModal(false);
    }
  };

  const handleBlockClick = (category: Category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const confirmBlockUser = async () => {
    if (!selectedCategory) return;
    try {
      const newStatus = !selectedCategory.is_block;
      const response = await block_category({
        id: selectedCategory._id,
        is_block: newStatus,
      });

      if (response.success) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === response.category._id ? response.category : cat
          )
        );
        toast.success(response.message);
      }
    } catch {
      toast.error("Failed to update category status");
    } finally {
      setShowModal(false);
      setSelectedCategory(null);
    }
  };

  const columns: TableColumn<Category>[] = [
    {
      key: "image",
      label: "Image",
      render: (item) => (
        <Image
          src={item.image}
          alt="Category"
          width={400}
          height={300}
          className="w-full  h-52 md:h-16 rounded-lg object-cover"
        />
      ),
    },
    {
      key: "description",
      label: "Details",
      render: (item) => (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
          <div className="md:mr-4">
            <p className="font-bold text-lg">{item.category_name}</p>
            <p className="text-sm text-gray-500">{item.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: "is_block",
      label: "Actions",
      render: (item) => (
        <div className="flex flex-row items-center space-x-2">
          <Button
            onClick={() => handleBlockClick(item)}
            className={`${
              item.is_block ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {item.is_block ? "Unblock" : "Block"}
          </Button>
          <Button
            onClick={() => {
              setSelectedCategory(item);
              setShowEditCategoryModal(true);
            }}
            className="bg-zinc-900 text-white"
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const apiUrl = "/category";

  return (
    <div className="p-6 md:p-1 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-700 mb-6">
          Category List
        </h1>
        <Table<Category>
          columns={columns}
          apiUrl={apiUrl}
          addButton={addCategory}
          buttonName="Add Category"
          data={categories}
          setData={setCategories}
        />

        {showModal && selectedCategory && (
          <BlockModal
            title="Confirm Action"
            onClose={() => setShowModal(false)}
            onConfirm={confirmBlockUser}
          >
            <p>
              Are you sure you want to{" "}
              {selectedCategory.is_block ? "unblock" : "block"} this category?
            </p>
          </BlockModal>
        )}

        {showAddCategoryModal && (
          <CategoryModal
            isOpen={showAddCategoryModal}
            onClose={() => setShowAddCategoryModal(false)}
            onSubmit={handleAddCategory}
            title="Add Category"
            loading={buttonLoading}
          />
        )}

        {showEditCategoryModal && selectedCategory && (
          <CategoryModal
            isOpen={showEditCategoryModal}
            onClose={() => setShowEditCategoryModal(false)}
            onSubmit={handleEditCategory}
            initialData={selectedCategory}
            title="Edit Category"
            loading={buttonLoading}
          />
        )}
      </div>
    </div>
  );
}
