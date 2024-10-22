"use client";
import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstence";
import toast from "react-hot-toast";
import BlockModal from "@/components/modal/blockModal";
import CategoryModal, {
  CategoryFormValues,
} from "@/components/modal/CategoryModal";
import Table, { TableColumn } from "@/components/Table";
import Image from "next/image";
import Category from "@/interfaces/category";
import { Button } from "@nextui-org/react";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAddCategoryModal, setShowAddCategoryModal] =
    useState<boolean>(false);
  const [showEditCategoryModal, setShowEditCategoryModal] =
    useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const handleAddCategory = async (data: CategoryFormValues) => {
    try {
      setButtonLoading(true);
      const formData = new FormData();
      formData.append("category_name", data.category_name);
      formData.append("description", data.description);
      if (data.image) formData.append("image", data.image);

      const response = await axiosInstance.post("/category/add", formData);
      if (response.status === 201) {
        setCategories([...categories, response.data.category]);
        toast.success("Category added successfully");
      }
    } catch (error) {
      toast.error("Failed to add category");
    } finally {
      setShowAddCategoryModal(false);
      setButtonLoading(false);
    }
  };

  const handleEditCategory = async (data: CategoryFormValues) => {
    if (!selectedCategory) return;
    try {
      setButtonLoading(true);
      const formData = new FormData();
      formData.append("category_name", data.category_name);
      formData.append("description", data.description);
      if (data.image) formData.append("image", data.image);

      const response = await axiosInstance.post(
        `/category/update/${selectedCategory._id}`,
        formData
      );

      if (response.status === 200) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === response.data.category._id
              ? response.data.category
              : cat
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
      const response = await axiosInstance.patch("/category/block", {
        id: selectedCategory._id,
        is_block: newStatus,
      });

      if (response.status === 200) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === response.data.category._id
              ? response.data.category
              : cat
          )
        );
        toast.success(response.data.message);
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
          width={80}
          height={80}
          className="w-16 h-16 rounded-lg shadow"
        />
      ),
    },
    { key: "category_name", label: "Category Name" },
    { key: "description", label: "Description" },
    {
      key: "is_block",
      label: "Blocked",
      render: (item) => (
        <Button
          onClick={() => handleBlockClick(item)}
          className={`${item.is_block ? "bg-green-300" : "bg-red-300"}`}
        >
          {item.is_block ? "Unblock" : "Block"}
        </Button>
      ),
    },
    {
      key: "_id",
      label: "Edit",
      render: (item) => (
        <Button
          className="text-sm text-bold bg-blue-500"
          onClick={() => {
            setSelectedCategory(item);
            setShowEditCategoryModal(true);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  const apiUrl = "/category"; 

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowAddCategoryModal(true)}
          className="px-4 py-2 bg-yellow-600 text-white rounded"
        >
          Add Category
        </button>
      </div>

      <Table<Category> columns={columns} apiUrl={apiUrl} />

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
  );
}
