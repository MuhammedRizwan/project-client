"use client";
import { Category } from "@/interfaces/category";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";

export interface PackageFormValues {
  packageName: string;
  category: Category[];
  maxPerson: number;
  noOfDays: number;
  noOfNights: number;
  destinations: string[];
  price: number;
  itineraries: {
    day: number;
    activities: { time: string; activity: string }[];
  }[];
  images: string[];
}

interface PackageFormProps {
  initialData?: PackageFormValues;
  categories: Category[];
  onSubmit: (data: PackageFormValues) => void;
  formTitle: string;
}

export default function PackageForm({
  initialData,
  categories,
  onSubmit,
  formTitle,
}: PackageFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm<PackageFormValues>({
    defaultValues: {
      itineraries: [{ day: 1, activities: [{ time: "", activity: "" }] }],
      destinations: [""],
      images: [],
      ...initialData,
    },
  });
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "itineraries",
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setImages(initialData.images || []);
    }
  }, [initialData, reset]);

  const [selectedKeys, setSelectedKeys] = useState(new Set([""]));

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const handleSelectionChange = (keys: unknown) => {
    console.log(keys);
    
    const selectedCategory = categories.find((category) => category._id === keys);
    setSelectedKeys(new Set([selectedCategory?.category_name ?? '']));
    setValue("category", selectedCategory ? [selectedCategory] : []);
  };

  const handleDaysChange = (value: number) => {
    const currentItineraries = getValues("itineraries");

    if (value > currentItineraries.length) {
      for (let i = currentItineraries.length; i < value; i++) {
        append({ day: i + 1, activities: [{ time: "", activity: "" }] });
      }
    } else {
      for (let i = currentItineraries.length; i > value; i--) {
        remove(i - 1);
      }
    }
  };

  const [destinations, setDestinations] = useState<string[]>(
    getValues("destinations") || []
  );

  // Function to add a new destination
  const handleAddDestination = () => {
    setDestinations([...destinations, ""]);
  };

  // Function to remove a destination
  const handleRemoveDestination = (index: number) => {
    const updatedDestinations = destinations.filter((_, i) => i !== index);
    setDestinations(updatedDestinations);
    setValue("destinations", updatedDestinations); // Update the form state
  };

  // Function to update a destination in the array
  const handleChangeDestination = (index: number, value: string) => {
    const updatedDestinations = [...destinations];
    updatedDestinations[index] = value;
    setDestinations(updatedDestinations);
    setValue("destinations", updatedDestinations); // Update the form state
  };

  const handleAddActivity = (dayIndex: number) => {
    const currentItineraries = getValues("itineraries");
    currentItineraries[dayIndex].activities.push({ time: "", activity: "" });
    setValue("itineraries", [...currentItineraries]);
  };

  const handleRemoveActivity = (dayIndex: number, activityIndex: number) => {
    const currentItineraries = getValues("itineraries");
    currentItineraries[dayIndex].activities.splice(activityIndex, 1);
    setValue("itineraries", [...currentItineraries]);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prevImages) => [...prevImages, ...fileArray]);
      setValue("images", [...getValues("images"), ...fileArray]);
    }
  };

  const handleDelete = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setValue("images", updatedImages);
    URL.revokeObjectURL(images[index]);
  };

  const handleChange = (index: number) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target && target.files && target.files[0]) {
        const newImageFile = target.files[0];
        const newImageUrl = URL.createObjectURL(newImageFile);
        const updatedImages = [...images];
        updatedImages[index] = newImageUrl;
        setImages(updatedImages);
        setValue("images", updatedImages);
      }
    };
    fileInput.click();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold mb-4">{formTitle}</h1>
        <p className="text-gray-600">
          Fill in the form to {formTitle.toLowerCase()} a package.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="name"
            >
              Package Name
            </label>
            <Input
              {...register("packageName", {
                required: "Package name is required",
                maxLength: {
                  value: 30,
                  message: "Package name must be at most 30 characters",
                },
                validate: {
                  noSpecialChars: (value) =>
                    /^[A-Za-z0-9_]+$/.test(value) ||
                    "No special characters allowed",
                  singleUnderscore: (value) =>
                    (value.match(/_/g)?.length || 0) <= 1 ||
                    "Only one underscore is allowed",
                  capitalize: (value) => {
                    const capitalizedValue = value.replace(/\b\w/g, (char) =>
                      char.toUpperCase()
                    );
                    setValue("packageName", capitalizedValue);
                    return true;
                  },
                },
              })}
              placeholder="Type Package Name"
            />
            <p className="text-red-500 text-xs min-h-[20px]">
              {errors.packageName?.message || ""}
            </p>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" className="capitalize w-full">
                  {selectedValue || "Select Category"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Category Selection"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedKeys}
                onSelectionChange={(keys) => {
                  const selectedCategory = Array.from(keys).join("");
                  handleSelectionChange(selectedCategory);
                }}
                className="w-full"
              >
                {categories.map((category: Category) => (
                  <DropdownItem key={category._id}>
                    {category.category_name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

          
            <input
              type="hidden"
              value={selectedValue} // Pass the selected value here
              {...register("category", {
                required: "Category is required",
              })}
            />

            {/* Validation error display */}
            <p className="text-red-500 text-xs min-h-[20px]">
              {errors.category?.message || ""}
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
              {...register("maxPerson", {
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
              {errors.maxPerson?.message || ""}
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
              {...register("noOfDays", {
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
              {errors.noOfDays?.message || ""}
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
              {...register("noOfNights", {
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
                    const days = getValues("noOfDays");
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
              {errors.noOfNights?.message || ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="max-person"
            >
              Destination
            </label>
            {destinations.map((destination, index) => (
              <div
                key={index}
                className="flex items-start mb-2 justify-between "
              >
                <div>
                  <Input
                    {...register(`destinations.${index}`, {
                      required: "Destination is required",
                      pattern: {
                        value: /^[A-Za-z0-9 ]+$/,
                        message:
                          "No special characters allowed in destination name",
                      },
                    })}
                    value={destination}
                    placeholder="Destination"
                    className="flex-grow w-96"
                    onChange={(e) =>
                      handleChangeDestination(index, e.target.value)
                    }
                  />

                  <p className="text-red-500 text-xs min-h-[20px]">
                    {errors.destinations?.[index]?.message}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => handleRemoveDestination(index)}
                  className="ml-2"
                  color="danger"
                  isIconOnly
                >
                  X
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={handleAddDestination}
              color="primary"
            >
              + Add Destination
            </Button>
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
              {...register("price", {
                required: "Price is required",
                min: {
                  value: 1,
                  message: "Price must be at least 1",
                },
              })}
              placeholder="Price of package"
            />
            <p className="text-red-500 text-xs min-h-[20px]">
              {errors.price?.message || ""}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-8">
        <h1 className="text-2xl font-bold mb-4">Itineraries</h1>
        <p className="text-gray-600 mb-4">Add activities for each day.</p>

        {fields.map((field, dayIndex) => (
          <div key={field.id} className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Day {dayIndex + 1}</h2>

            {field.activities.map((activity, activityIndex) => (
              <div key={activityIndex} className="flex space-x-4 mb-4">
                <Input
                  type="time"
                  className="w-32" // Reduced size of the time input
                  {...register(
                    `itineraries.${dayIndex}.activities.${activityIndex}.time`
                  )}
                  placeholder="Activity Time"
                />
                {errors.itineraries?.[dayIndex]?.activities?.[activityIndex]
                  ?.time && (
                  <span className="text-red-500 text-sm">
                    {
                      errors.itineraries[dayIndex].activities[activityIndex]
                        .time.message
                    }
                  </span>
                )}
                <Input
                  {...register(
                    `itineraries.${dayIndex}.activities.${activityIndex}.activity`
                  )}
                  placeholder="Activity Description"
                />
                <Button
                  type="button"
                  color="danger"
                  onClick={() => handleRemoveActivity(dayIndex, activityIndex)}
                >
                  Remove Activity
                </Button>
              </div>
            ))}

            <Button
              type="button"
              color="primary"
              onClick={() => handleAddActivity(dayIndex)}
              className="mt-4"
            >
              Add Activity
            </Button>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-8">
        <h1 className="text-2xl font-bold mb-4">Images</h1>
        <p className="text-gray-600 mb-4">
          Upload images related to the package.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <Image
                src={image}
                alt={`Uploaded image ${index + 1}`}
                width={300}
                height={200}
                className="rounded-md"
              />
              <Button
                type="button"
                color="danger"
                onClick={() => handleDelete(index)}
                className="absolute top-0 right-0"
              >
                Remove
              </Button>
              <Button
                type="button"
                onClick={() => handleChange(index)}
                className="absolute top-0 left-0"
              >
                Change
              </Button>
            </div>
          ))}
        </div>
        <Input
          type="file"
          onChange={handleImageChange}
          multiple
          className="mt-4"
        />
      </div>

      <div className=" mx-auto  p-8  mt-8 flex justify-end">
        <Button type="submit" className="bg-yellow-700 hover:bg-yellow-800">
          Submit Package
        </Button>
      </div>
    </form>
  );
}
