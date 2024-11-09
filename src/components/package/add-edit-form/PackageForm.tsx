"use client";
import Category from "@/interfaces/category";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Textarea,
} from "@nextui-org/react";
import Image from "next/image";
import { useState, useEffect, useMemo} from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiCircle, FiEdit2, FiTrash2, FiUpload } from "react-icons/fi";

export interface PackageFormValues {
  package_name: string;
  category: Category[];
  max_person: number;
  no_of_days: number;
  no_of_nights: number;
  destinations: string[];
  original_price: number;
  itineraries: {
    day: number;
    activities: { time: string; activity: string }[];
  }[];
  includedItems: string[];
  excludedItems: string[];
  description: string;
  departure_place: string;
  images: File[];
  category_id?:Category
}

interface Activity {
  time: string;
  activity: string;
}

// Define the shape of an itinerary for a single day
interface Itinerary {
  day: number;
  activities: Activity[];
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
    formState: { errors },
    setValue,
    getValues,
    reset,
    setError,
  } = useForm<PackageFormValues>({
    defaultValues: {
      destinations: [""],
      images: [],
      includedItems: [""],
      excludedItems: [""],
      ...initialData,
    },
  });
  const [images, setImages] = useState<File[]>([]);
  const [includedItems, setIncludedItems] = useState<string[]>([]);
  const [excludedItems, setExcludedItems] = useState<string[]>([]);
  const [newIncludedItem, setNewIncludedItem] = useState<string>("");
  const [newExcludedItem, setNewExcludedItem] = useState<string>("");
  const [includedError, setIncludedError] = useState<string>("");
  const [excludedError, setExcludedError] = useState<string>("");
  const [, setNoOfDays] = useState<number>(1);
  const [activityError, setActivityError] = useState<string>("");
  const [errorMessages, setErrorMessages] = useState<string[][]>([]);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>([
    { day: 1, activities: [{ time: "", activity: "" }] },
  ]);
  useEffect(() => {
    if (includedError || excludedError) {
      const timer = setTimeout(() => {
        setIncludedError("");
        setExcludedError("");
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [includedError, excludedError]);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setImages(initialData.images || []);
      setItineraries(initialData.itineraries || []);
      setIncludedItems(initialData.includedItems || []);
      setExcludedItems(initialData.excludedItems || []);
      setValue('category',initialData.category_id ? [initialData.category_id] : [])
    }
  }, []);

  const [selectedKeys, setSelectedKeys] = useState(
    new Set([initialData?.category?.[0].category_name || ""])
  );

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const handleSelectionChange = (keys: unknown) => {
    const selectedCategory = categories.find(
      (category) => category._id === keys
    );
    setSelectedKeys(new Set([selectedCategory?.category_name ?? ""]));
    setValue("category", selectedCategory ? [selectedCategory] : []);
  };

  const handleDaysChange = (days: number) => {
    setNoOfDays(days);
    const newItineraries = Array.from({ length: days }, (_, index) => ({
      day: index + 1,
      activities: itineraries[index]?.activities || [
        { time: "", activity: "" },
      ],
    }));
    setItineraries(newItineraries);
    setValue("itineraries", newItineraries);
  };

  const isValidTime = (
    dayIndex: number,
    activityIndex: number,
    time: string
  ): boolean => {
    if (activityIndex === 0) return true;

    const previousTime =
      itineraries[dayIndex].activities[activityIndex - 1].time;
    return previousTime <= time;
  };

  const handleInputChange = (
    dayIndex: number,
    activityIndex: number,
    field: keyof Activity,
    value: string
  ) => {
    const updatedItineraries = [...itineraries];
    updatedItineraries[dayIndex].activities[activityIndex][field] = value;

    if (field === "time" && !isValidTime(dayIndex, activityIndex, value)) {
      updateError(
        dayIndex,
        activityIndex,
        "Time must be after the previous activity."
      );
    } else {
      updateError(dayIndex, activityIndex, "");
    }

    setItineraries(updatedItineraries);
    setValue("itineraries", updatedItineraries);
  };

  const updateError = (
    dayIndex: number,
    activityIndex: number,
    message: string
  ) => {
    const updatedErrors = [...errorMessages];
    if (!updatedErrors[dayIndex]) {
      updatedErrors[dayIndex] = [];
    }
    updatedErrors[dayIndex][activityIndex] = message;
    setErrorMessages(updatedErrors);
  };

  const handleAddActivity = (dayIndex: number) => {
    const updatedItineraries = [...itineraries];

    if (updatedItineraries[dayIndex].activities.length >= 5) {
      setActivityError(
        `You can only add up to 5 activities for Day ${dayIndex + 1}`
      );
      return;
    }

    updatedItineraries[dayIndex].activities.push({ time: "", activity: "" });
    setItineraries(updatedItineraries);
    setValue("itineraries", updatedItineraries);
  };

  const handleRemoveActivity = (dayIndex: number, activityIndex: number) => {
    if (activityIndex === 0) {
      setActivityError(`cannot remove first activity for Day ${dayIndex + 1}`);
      return;
    }

    const updatedItineraries = [...itineraries];
    updatedItineraries[dayIndex].activities.splice(activityIndex, 1);
    setItineraries(updatedItineraries);
    setValue("itineraries", updatedItineraries);
  };

  const [destinations, setDestinations] = useState<string[]>(
    initialData?.destinations || [""]
  );

  const handleAddDestination = () => {
    if (destinations.length < 4) {
      setDestinations([...destinations, ""]);
    } else {
      setDestinationError("You can only add up to 4 destinations");
    }
    setTimeout(() => {
      setDestinationError(null);
    }, 15000);
  };

  const handleRemoveDestination = (index: number) => {
    if (index !== 0) {
      const updatedDestinations = destinations.filter((_, i) => i !== index);
      setDestinations(updatedDestinations);
      setValue("destinations", updatedDestinations);
    } else {
      setDestinationError("cannot remove first destination");
    }
    setTimeout(() => {
      setDestinationError(null);
    }, 15000);
  };

  const handleChangeDestination = (index: number, value: string) => {
    const updatedDestinations = [...destinations];
    updatedDestinations[index] = value;
    setDestinations(updatedDestinations);
    setValue("destinations", updatedDestinations);
  };
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    // Check if the current images have reached the maximum limit
    if (images.length >= 6) {
      setError("images", { type: "manual", message: "maximum 6 images" });
      return;
    }

    if (files) {
      const acceptedFileTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
        "image/jpg",
      ];
      const validImages = Array.from(files).filter((file) =>
        acceptedFileTypes.includes(file.type)
      );
      const remainingSlots = 6 - images.length;
      const imagesToAdd = validImages.slice(0, remainingSlots);

      if (imagesToAdd.length > 0) {
        setImages((prevImages) => [...prevImages, ...imagesToAdd]);
        setValue("images", [...images, ...imagesToAdd]);
      } else {
        setError("images", {
          type: "manual",
          message: "Please select valid image",
        });
      }
    }
  };

  const handleDelete = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setValue("images", updatedImages); // Adjust image names
    toast.success("Image deleted successfully");
  };

  const handleChange = (index: number) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // Only allow image selection

    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;

      if (target && target.files && target.files[0]) {
        const acceptedFileTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/svg+xml",
          "image/jpg",
        ]; // Allowed image formats

        const newImageFile = target.files[0];
        if (!acceptedFileTypes.includes(newImageFile.type)) {
          setError("images", {
            type: "manual",
            message: "Please select valid image",
          });
          return;
        }
        const updatedImages = [...images];
        updatedImages[index] = newImageFile;

        setImages(updatedImages); // Update state
        setValue("images", updatedImages); // Sync with form state

        toast.success("Image uploaded successfully");
      } else {
        setError("images", {
          type: "manual",
          message: "Please select an image",
        });
      }
    };

    fileInput.click(); // Open the file dialog
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

  // Submit handler
  const onSubmitHandler = (data: PackageFormValues) => {
    const formData = new FormData();
    formData.append("packageName", data.package_name);
    formData.append("maxPerson", data.max_person.toString());
    formData.append("noOfDays", data.no_of_days.toString());
    formData.append("noOfNights", data.no_of_nights.toString());
    formData.append("price", data.original_price.toString());
    formData.append("category", JSON.stringify(data.category));
    formData.append("destinations", JSON.stringify(data.destinations));
    formData.append("itineraries", JSON.stringify(data.itineraries));
    formData.append("includedItems", JSON.stringify(data.includedItems));
    formData.append("excludedItems", JSON.stringify(data.excludedItems));
    formData.append("description", JSON.stringify(data.description));
    formData.append("departure", JSON.stringify(data.departure_place));
    images.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
    const packageFormValues: PackageFormValues = {
      package_name: data.package_name,
      category: JSON.parse(formData.get("category") as string),
      max_person: parseInt(formData.get("maxPerson") as string),
      no_of_days: parseInt(formData.get("noOfDays") as string),
      no_of_nights: parseInt(formData.get("noOfNights") as string),
      original_price: parseInt(formData.get("price") as string),
      destinations: JSON.parse(formData.get("destinations") as string),
      itineraries: JSON.parse(formData.get("itineraries") as string),
      includedItems: JSON.parse(formData.get("includedItems") as string),
      excludedItems: JSON.parse(formData.get("excludedItems") as string),
      description: JSON.parse(formData.get("description") as string),
      departure_place: JSON.parse(formData.get("departure") as string),
      images: images,
    };
    onSubmit(packageFormValues);
  };
console.log(images)
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
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
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" className="capitalize w-full">
                  {selectedValue || initialData?.category_id?.category_name || "Select Category"}
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
                  <DropdownItem
                    key={category._id}
                    className="capitalize w-full"
                  >
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

      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-8">
        <h1 className="text-2xl font-bold mb-4">Destination And Description</h1>
        <p className="text-gray-600 mb-4">
          Upload images related to the package.
        </p>

        <div className=" w-full">
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="max-person"
            >
              Destination
            </label>
            <div className="grid grid-cols-2 gap-x-4">
              {destinations.map((destination, index) => (
                <div
                  key={index}
                  className="flex items-start mb-2 justify-between "
                >
                  <div className="flex-grow w-2/3">
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
                      className="flex-grow w-full"
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
                    className=""
                    color="danger"
                    isIconOnly
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-red-500 text-xs">{destinationError || ""}</p>
            <Button
              type="button"
              onClick={handleAddDestination}
              color="primary"
            >
              + Add Destination
            </Button>
          </div>
        </div>

        <div className="mb-4 w-full">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="Description"
          >
            Description
          </label>
          <Textarea
            rows={10}
            type="text"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters long",
              },
              maxLength: {
                value: 500,
                message: "Description cannot exceed 500 characters",
              },
            })}
            placeholder="Description for the package"
          />
          <p className="text-red-500 text-xs min-h-[20px]">
            {errors.description?.message || ""}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-8">
        <h1 className="text-2xl font-bold mb-4">Itineraries</h1>
        <p className="text-gray-600 mb-4">Add activities for each day.</p>

        {itineraries.map((itinerary: Itinerary, dayIndex) => (
          <div key={dayIndex} className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Day {dayIndex + 1}</h2>

            {itinerary.activities.map((activity, activityIndex) => (
              <div key={activityIndex} className="mb-4">
                <div className="flex space-x-4">
                  {/* Time Input with Error */}
                  <div className="flex flex-col">
                    <Input
                      type="time"
                      value={activity.time}
                      className="w-32"
                      {...register(
                        `itineraries.0.activities.${activityIndex}.time`,
                        {
                          required: "Time is required",
                          onChange(e) {
                            handleInputChange(
                              dayIndex,
                              activityIndex,
                              "time",
                              e.target.value
                            );
                          },
                        }
                      )}
                    />
                    {errors.itineraries?.[0]?.activities?.[activityIndex]
                      ?.time && (
                      <p className="text-red-500 text-xs mt-1">
                        {
                          errors.itineraries[0].activities[activityIndex].time
                            ?.message
                        }
                      </p>
                    )}
                  </div>

                  {/* Activity Description Input */}
                  <div className="flex flex-col w-full">
                    <Input
                      value={activity.activity}
                      placeholder="Activity Description"
                      {...register(`itineraries.0.activities.${activityIndex}.activity`, {
                        required: "Activity description is required",
                        onChange(e) {
                          handleInputChange(
                            dayIndex,
                            activityIndex,
                            "activity",
                            e.target.value
                          )
                        },
                      })}
                    />
                    {errors.itineraries?.[0]?.activities?.[activityIndex]
                      ?.activity && (
                      <p className="text-red-500 text-xs mt-1">
                        {
                          errors.itineraries[0].activities[activityIndex]
                            .activity?.message
                        }
                      </p>
                    )}
                  </div>
                  {/* Remove Button */}
                  <Button
                    color="danger"
                    onClick={() =>
                      handleRemoveActivity(dayIndex, activityIndex)
                    }
                    disabled={activityIndex === 0}
                  >
                    Remove
                  </Button>
                </div>
                <div>
                  {errorMessages[dayIndex]?.[activityIndex] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errorMessages[dayIndex][activityIndex] || " "}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <p className="text-red-500 text-xs">{activityError}</p>
            <Button
              color="primary"
              onClick={() => handleAddActivity(dayIndex)}
              className="mt-4"
              disabled={itinerary.activities.length >= 5}
            >
              Add Activity
            </Button>
          </div>
        ))}
      </div>

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
                      items.length > 0 || "At least one included item is required",
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
                      items.length > 0 || "At least one excluded item is required",
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

      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-8">
        <h1 className="text-2xl font-bold mb-4">Images</h1>
        <p className="text-gray-600 mb-4">
          Upload images related to the package.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full  h-[450px] bg-slate-100 p-4 shadow-inner">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group w-[300px] h-[200px] overflow-hidden rounded-md border border-gray-300"
            >
              { image instanceof File ? (
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`Uploaded image ${index + 1}`}
                  width={300}
                  height={200}
                  className="object-cover w-full h-full"
                  onLoad={() => URL.revokeObjectURL(URL.createObjectURL(image))} // Clean up URL
                />
              ) : (
                <Image
                src={image}
                alt={`Uploaded image ${index + 1}`}
                width={300}
                height={200}
                className="object-cover w-full h-full"
                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(image))} // Clean up URL
              />
              )}

              <input
                type="file"
                id={`image-input-${index}`}
                onChange={(e) => handleImageChange(e)}
                className="hidden"
              />

              {/* Centered Icons */}
              <div className="absolute inset-0 flex justify-center items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                <Button
                  onClick={() => handleChange(index)}
                  className="bg-white/80 p-2 rounded-full"
                >
                  <FiEdit2 size={20} color="black" />
                </Button>

                <Button
                  onClick={() => handleDelete(index)}
                  className="bg-white/80 p-2 rounded-full"
                >
                  <FiTrash2 size={20} color="black" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <label htmlFor="upload-input" className="mt-4 cursor-pointer flex ">
          <FiUpload size={24} className="inline-block mr-2" /> Upload Images
        </label>
        <input
          type="file"
          id="upload-input"
          multiple
          className="hidden"
          {...register("images", {
            validate: {
              // Ensure at least one file is selected
              notEmpty: (files) =>
                files?.length > 0 || "You must select at least one file.",  
            },
          })}
          onChange={handleImageChange}
        />

        <p className="text-red-500 text-xs py-2">
          {errors.images?.message || ""}
        </p>
      </div>

      <div className=" mx-auto  p-8  mt-8 flex justify-end">
        <Button type="submit" className="bg-yellow-700 hover:bg-yellow-800">
          {initialData ? "Save Changes" : "Create Package"}
        </Button>
      </div>
    </form>
  );
}