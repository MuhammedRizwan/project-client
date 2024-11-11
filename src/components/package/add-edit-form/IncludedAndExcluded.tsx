import { Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FiCircle, FiTrash2 } from "react-icons/fi";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { PackageFormValues } from "@/interfaces/package";

interface IncludedAndExcludedProps {
    register:  UseFormRegister<PackageFormValues>;
    errors: FieldErrors<PackageFormValues> ;
    setValue: UseFormSetValue<PackageFormValues>
    includedItems:string[]
    excludedItems:string[]
    setIncludedItems: React.Dispatch<React.SetStateAction<string[]>>
    setExcludedItems:React.Dispatch<React.SetStateAction<string[]>>
}
export default function IncludedAndExcluded({
  register,
  errors,
  setValue,
  includedItems,
  excludedItems,
  setExcludedItems,
  setIncludedItems,
}: IncludedAndExcludedProps) {
  const [newIncludedItem, setNewIncludedItem] = useState<string>("");
  const [newExcludedItem, setNewExcludedItem] = useState<string>("");
  const [includedError, setIncludedError] = useState<string>("");
  const [excludedError, setExcludedError] = useState<string>("");

  useEffect(() => {
    if (includedError || excludedError) {
      const timer = setTimeout(() => {
        setIncludedError("");
        setExcludedError("");
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [includedError, excludedError]);
  const addIncludedItem = () => {
    if (newIncludedItem.length <= 0) setIncludedError("item is required");
    if (newIncludedItem) {
      if (includedItems.includes(newIncludedItem)) {
        setIncludedError("item is already included");
        setNewIncludedItem(""); // Clear input field
        return;
      }
      if (excludedItems.includes(newIncludedItem)) {
        setIncludedError("item is already excluded");
        setNewIncludedItem(""); // Clear input field
        return;
      }
      if (newIncludedItem)
        setIncludedItems((prev) => [...prev, newIncludedItem]);
      setValue("includedItems", [...includedItems, newIncludedItem]);
      setNewIncludedItem(""); // Clear input field
    }
  };

  // Remove included item
  const removeIncluded = (index: number) => {
    setIncludedItems((prev) => prev.filter((_, i) => i !== index));
    setValue("includedItems", includedItems);
  };

  // Add excluded item
  const addExcludedItem = () => {
    if (newExcludedItem.length <= 0) setExcludedError("item is required");
    if (newExcludedItem) {
      if (includedItems.includes(newExcludedItem)) {
        setExcludedError("item is already included");
        setNewIncludedItem(""); // Clear input field
        return;
      }
      if (excludedItems.includes(newExcludedItem)) {
        setExcludedError("item is already excluded");
        setNewIncludedItem(""); // Clear input field
        return;
      }
      setExcludedItems((prev) => [...prev, newExcludedItem]);
      setValue("excludedItems", [...excludedItems, newExcludedItem]);
      setNewExcludedItem(""); // Clear input field
    }
  };

  // Remove excluded item
  const removeExcluded = (index: number) => {
    setExcludedItems((prev) => prev.filter((_, i) => i !== index));
    setValue("excludedItems", excludedItems);
  };

  const handleIncludedItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    setNewIncludedItem(capitalizedValue);
  };
  const handleExcludedItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    setNewExcludedItem(capitalizedValue);
  };
  return (
    <div className="max-w-6xl  mx-auto bg-white p-8 rounded-lg shadow-xl mt-8">
      <h1 className="text-2xl font-bold mb-4">
        Included and Excluded in the Package
      </h1>
      <div className="md:flex">
        <div className="mb-6 md:w-1/2 h-80 bg-slate-50  p-3 shadow-inner border m-2">
          <h2 className="text-xl font-semibold mb-2">Included Items</h2>
          <div>
            <div className="flex items-center gap-2">
              <Input
                value={newIncludedItem}
                placeholder="Add included item"
                fullWidth
                {...register("includedItems", {
                  validate: (items: string[]) =>
                    items.length > 0 ||
                    "At least one included item is required",
                  onChange: handleIncludedItemChange,
                })}
              />
              <Button color="success" type="button" onClick={addIncludedItem}>
                Add
              </Button>
            </div>
            <p className="text-red-500 text-xs">
              {errors.includedItems?.message}
            </p>
          </div>
          <p className="text-red-500 text-xs">{includedError || ""}</p>
          <ul className="list-disc pl-5">
            {includedItems.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center space-y-2"
              >
                <div className="flex items-center">
                  <FiCircle size={12} className="text-gray-500 mr-5 mt-1" />
                  <span>{item}</span>
                </div>
                <Button
                  color="danger"
                  onClick={() => removeIncluded(index)}
                  className="w-10 h-7"
                >
                  <FiTrash2 size={10} color="white" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-6 md:w-1/2 h-80 bg-slate-50  p-3 shadow-inner border m-2">
          <h2 className="text-xl font-semibold mb-2">Excluded Items</h2>
          <div>
            <div className="flex items-center gap-2 ">
              <Input
                value={newExcludedItem}
                placeholder="Add excluded item"
                fullWidth
                autoCapitalize="words"
                {...register("excludedItems", {
                  validate: (items: string[]) =>
                    items.length > 0 ||
                    "At least one excluded item is required",
                  onChange: handleExcludedItemChange,
                })}
              />
              <Button color="success" type="button" onClick={addExcludedItem}>
                Add
              </Button>
            </div>
            <p className="text-red-500 text-xs">
              {errors.excludedItems?.message}
            </p>
          </div>
          <p className="text-red-500 text-xs">{excludedError || ""}</p>
          <ul className="list-disc pl-5">
            {excludedItems.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center space-y-2"
              >
                <div className="flex items-center">
                  <FiCircle size={12} className="text-gray-500 mr-5 mt-1" />
                  <span>{item}</span>
                </div>
                <Button
                  color="danger"
                  onClick={() => removeExcluded(index)}
                  className="w-10 h-7"
                >
                  <FiTrash2 size={10} color="white" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
