import { Input, Select, SelectItem } from "@nextui-org/react";
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import Category from "@/interfaces/category";
import { ChangeEvent, useEffect, useState } from "react";
import { PackageFormValues } from "@/interfaces/package";

interface PackageFormDataProps {
  formTitle: string;
  register: UseFormRegister<PackageFormValues>;
  errors: FieldErrors<PackageFormValues>;
  categories: Category[];
  getValues: UseFormGetValues<PackageFormValues>;
  setValue: UseFormSetValue<PackageFormValues>;
  itineraries: {
    day: number;
    activities: { time: string; activity: string }[];
  }[];
  setItineraries: (
    itineraries: {
      day: number;
      activities: { time: string; activity: string }[];
    }[]
  ) => void;
  initialData?: PackageFormValues;
}

export default function PackageFormData({
  formTitle,
  register,
  errors,
  categories,
  getValues,
  setValue,
  itineraries,
  setItineraries,
  initialData
}: PackageFormDataProps) {
  const [category, setCategory] = useState<Category>();
  useEffect(() => {
    if (initialData?.category_id && categories.length > 0) {
      const matchingCategory = categories.find((category) => category._id === initialData.category_id);
      if (matchingCategory) {
        setCategory(matchingCategory);
      }
    }
  }, [initialData, categories])
  const handleDaysChange = (days: number) => {
    const newItineraries = Array.from({ length: days }, (_, index) => ({
      day: index + 1,
      activities: itineraries[index]?.activities || [
        { time: "", activity: "" },
      ],
    }));
    setItineraries(newItineraries);
    setValue("itineraries", newItineraries);
  };
  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue("category_id", event.target.value);
  };
  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">{formTitle}</h1>
      <p className="text-gray-600">
        Fill in the form to {formTitle.toLowerCase()} a package.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
            Package Name
          </label>
          <Input
            {...register("package_name", {
              required: "Package name is required",
              maxLength: {
                value: 30,
                message: "Package name must be at most 30 characters",
              },
              validate: {
                noSpecialChars: (value) =>
                  /^[A-Za-z0-9_ ]+$/.test(value) ||
                  "No special characters allowed, except spaces and one underscore",
                singleUnderscore: (value) =>
                  (value.match(/_/g)?.length || 0) <= 1 ||
                  "Only one underscore is allowed",
                capitalize: (value) => {
                  const capitalizedValue = value.replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                  );
                  setValue("package_name", capitalizedValue, {
                    shouldValidate: false,
                    shouldDirty: true,
                  });
                  return true;
                },
              },
            })}
            placeholder="Type Package Name"
          />
          <p className="text-red-500 text-xs min-h-[20px]">
            {errors.package_name?.message || ""}
          </p>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="category"
          >
            Category
          </label>
          <Select
            size="sm"
            label="Select an Category"
            placeholder={category?.category_name}
            className="max-w-lg "
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <SelectItem key={category._id}>
                {category.category_name}
              </SelectItem>
            ))}
          </Select>
          <p className="text-red-500 text-xs min-h-[20px]">
            {errors.category_id?.message || ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="max-person"
          >
            Maximum Person
          </label>
          <Input
            {...register("max_person", {
              required: "Maximum person count is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Maximum person must be a number",
              },
              min: {
                value: 1,
                message: "Minimum person count is 1",
              },
              max: {
                value: 30,
                message: "Maximum person cannot exceed 30",
              },
            })}
            placeholder="Maximum Person can go"
          />
          <p className="text-red-500 text-xs min-h-[20px]">
            {errors.max_person?.message || ""}
          </p>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="no-of-days"
          >
            No. of Days
          </label>
          <Input
            type="number"
            {...register("no_of_days", {
              required: "Number of days is required",
              min: { value: 1, message: "Number of days must be at least 1" },
              max: {
                value: 10,
                message: "Number of days must be at most 10",
              },
            })}
            placeholder="Number Of Days"
            onChange={(e) => handleDaysChange(Number(e.target.value))}
            max={10}
          />
          <p className="text-red-500 text-xs min-h-[20px]">
            {errors.no_of_days?.message || ""}
          </p>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="no-of-nights"
          >
            No. of Nights
          </label>
          <Input
            type="number"
            {...register("no_of_nights", {
              required: "Number of nights is required",
              min: {
                value: 0,
                message: "Number of nights must be at least 0",
              },
              max: {
                value: 10,
                message: "Number of nights must be at most 10",
              },
              validate: {
                adjustDays: (nights) => {
                  const days = getValues("no_of_days");
                  if (nights - days > 1 || nights - days < -1) {
                    return "Days must be either Nights - 1 or Nights + 1.";
                  }
                  return true;
                },
              },
            })}
            placeholder="Number Of Nights"
          />
          <p className="text-red-500 text-xs min-h-[20px]">
            {errors.no_of_nights?.message || ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="max-person"
          >
            Departure Place
          </label>
          <Input
            type="text"
            {...register("departure_place", {
              required: "Departure place is required",
              maxLength: {
                value: 30,
                message: "Departure place must be at most 30 characters",
              },
              pattern: {
                value: /^[a-zA-Z0-9\s]*$/,
                message: "Only letters and spaces are allowed",
              },
            })}
            placeholder="Departure place"
          />
          <p className="text-red-500 text-xs min-h-[20px]">
            {errors.original_price?.message || ""}
          </p>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="no-of-nights"
          >
            Price
          </label>
          <Input
            type="number"
            {...register("original_price", {
              required: "Price is required",
              min: {
                value: 1,
                message: "Price must be at least 1",
              },
            })}
            placeholder="Price of package"
          />
          <p className="text-red-500 text-xs min-h-[20px]">
            {errors.original_price?.message || ""}
          </p>
        </div>
      </div>
    </div>
  );
}
