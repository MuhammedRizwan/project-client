"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BlockModal from "@/components/modal/blockModal";
import AddModal from "@/components/modal/AddModal";
import Table from "@/components/Table";
import Category from "@/interfaces/category";
import { useForm } from "react-hook-form";
import Image from "next/image";

export default function Categories() {
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAddCategoryModal, setShowAddCategoryModal] =
    useState<boolean>(false);
  const [showEditCategoryModal, setShowEditCategoryModal] =
    useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Category>();

  const categoryColumns: {
    key: keyof Category;
    label: string;
    render?: (category: Category) => React.ReactNode;
  }[] = [
    {
      key: "image",
      label: "Image",
      render: (category: Category) => (
        <Image
          src={category.image}
          alt="Uploaded Image"
          width={80}
          height={80}
          className="w-16 h-16 rounded-lg shadow mb-4"
        />
      ),
    },
    { key: "category_name", label: "Name" },
    { key: "description", label: "Description" },
    {
      key: "is_block",
      label: "Action",
      render: (category: Category) => (
        <button
          onClick={() => handleBlockClick(category)}
          className={`px-4 py-2 ${
            category.is_block ? "bg-green-500" : "bg-red-500"
          } text-white rounded w-20`}
        >
          {category.is_block ? "Unblock" : "Block"}
        </button>
      ),
    },
    {
      key: "_id",
      label: "Edit details",
      render: (category: Category) => (
        <button
          onClick={() => editDetailsClick(category)}
          className="px-4 py-2 w-32 bg-yellow-700 text-white rounded"
        >
          View details
        </button>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/category"
        );
        const { categories } = response.data;
        setCategory(categories);
      } catch (error) {
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  const handleBlockClick = (category: Category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const confirmBlockUser = async () => {
    if (selectedCategory) {
      try {
        const newStatus = !selectedCategory.is_block;
        const res = await axios.patch(
          "http://localhost:5000/admin/category/block",
          {
            id: selectedCategory.category_name,
            is_block: newStatus,
          }
        );
        if (res.status === 200) {
          const updatedCategory = res.data.category;
          toast.success(res.data.message);
          setCategory((prevCategory) =>
            prevCategory.map((category) =>
              category._id === updatedCategory._id ? updatedCategory : category
            )
          );
        }
      } catch {
        toast.error("Failed to update category status");
      } finally {
        setShowModal(false);
        setSelectedCategory(null);
      }
    }
  };
  const editDetailsClick = (category: Category) => {
    setSelectedCategory(category);
    setShowEditCategoryModal(true);
    setSelectedFile(null);
    reset({
      category_name: category.category_name,
      description: category.description,
    });
  };

  const handleAddCategory = async (data: Category) => {
    try {
      const formData = new FormData();
      formData.append("category_name", data.category_name);
      formData.append("description", data.description);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      const response = await axios.post(
        "http://localhost:5000/admin/category/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        const addedCategory = response.data.category;
        setCategory((prevCategories) => [...prevCategories, addedCategory]);
        toast.success(response.data.message);
        reset();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to add category";
        toast.error(errorMessage);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setShowAddCategoryModal(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleEditCategory = async (data: Category) => {
    try {
      const formData = new FormData();
      formData.append("category_name", data.category_name);
      formData.append("description", data.description);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      const response = await axios.post(
        `http://localhost:5000/admin/category/update/${selectedCategory?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        const updatedCategory = response.data.category;
        setCategory((prevCategories) =>
          prevCategories.map((category) =>
            category._id === updatedCategory._id ? updatedCategory : category
          )
        );
        toast.success("Category updated successfully");
        reset(); // Reset form
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to edit category";
        toast.error(errorMessage);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setShowEditCategoryModal(false);
    }
  };

  return (
    <div>
      <div className="mb-4 w-full flex justify-end">
        <button
          onClick={() => {
            reset({
              category_name: "",
              description: "",
            });
            setShowAddCategoryModal(true);
          }}
          className="px-4 py-2 bg-yellow-600 text-white rounded"
        >
          Add Category
        </button>
      </div>

      <Table columns={categoryColumns} data={category} />

      {showModal && selectedCategory && (
        <BlockModal
          title="Confirm Block/Unblock"
          onClose={() => setShowModal(false)}
          onConfirm={confirmBlockUser}
        >
          <p>
            Are you sure you want to{" "}
            {selectedCategory.is_block ? "unblock" : "block"}{" "}
            {selectedCategory.category_name}?
          </p>
        </BlockModal>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <AddModal
          title="Add New Category"
          onClose={() => setShowAddCategoryModal(false)}
        >
          <form onSubmit={handleSubmit(handleAddCategory)}>
            <label className="block mb-2">Category Name</label>
            <input
              {...register("category_name", {
                required: "Category Name is required",
              })}
              className="border px-4 py-2 rounded w-full"
            />
            {errors.category_name && (
              <p className="text-red-600">{errors.category_name.message}</p>
            )}

            <label className="block mt-4 mb-2">Description</label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className="border px-4 py-2 rounded w-full"
            />
            {errors.description && (
              <p className="text-red-600">{errors.description.message}</p>
            )}

            <label className="block mt-4 mb-2">Image</label>
            <input
              type="file"
              onChange={(e) =>
                setSelectedFile(e.target.files ? e.target.files[0] : null)
              }
              className="border px-4 py-2 rounded w-full"
            />

            <button
              type="submit"
              className="px-4 py-2 mt-4 bg-green-500 text-white rounded"
            >
              Add Category
            </button>
          </form>
        </AddModal>
      )}

      {showEditCategoryModal && selectedCategory && (
        <AddModal
          title="Edit Category"
          onClose={() => setShowEditCategoryModal(false)}
        >
          <form onSubmit={handleSubmit(handleEditCategory)}>
            <label className="block mb-2">Category Name</label>
            <input
              {...register("category_name", {
                required: "Category Name is required",
              })}
              className="border px-4 py-2 rounded w-full"
            />
            {errors.category_name && (
              <p className="text-red-600">{errors.category_name.message}</p>
            )}

            <label className="block mt-4 mb-2">Description</label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className="border px-4 py-2 rounded w-full"
            />
            {errors.description && (
              <p className="text-red-600">{errors.description.message}</p>
            )}

            {selectedCategory.image && !selectedFile && (
              <div className="mt-4">
                <label className="block mb-2">Current Image</label>
                <Image
                  src={selectedCategory.image}
                  alt="Current Image"
                  width={150}
                  height={150}
                  className="rounded"
                />
              </div>
            )}

            {/* Selected File Preview */}
            {selectedFile && (
              <div className="mt-4">
                <label className="block mb-2">New Image Preview</label>
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected File"
                  width={150}
                  height={150}
                  className="rounded"
                />
              </div>
            )}

            {/* File Input */}
            <label className="block mt-4 mb-2">Change Image</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="border px-4 py-2 rounded w-full"
            />

            <button
              type="submit"
              className="px-4 py-2 mt-4 bg-yellow-500 text-white rounded"
            >
              Save Changes
            </button>
          </form>
        </AddModal>
      )}
    </div>
  );
}
