'use client'
import { Button, Input, Textarea } from "@nextui-org/react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { useState } from "react";
import { PackageFormValues } from "@/interfaces/package";

interface DescriptionProps {
    register:  UseFormRegister<PackageFormValues>;
    errors: FieldErrors<PackageFormValues> ;
    setValue: UseFormSetValue<PackageFormValues>
    initialData?:PackageFormValues
}
export default function Description({register,errors,setValue,initialData}:DescriptionProps) {
    const [destinations, setDestinations] = useState<string[]>(
        initialData?.destinations || [""]
      );
  const [destinationError, setDestinationError] = useState<string | null>(null);

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
  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-8">
      <h1 className="text-2xl font-bold mb-4">Destination And Description</h1>
      <p className="text-gray-600 mb-4">
        Add destinations and Description related to the package.
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
            {destinations.map((destination: string, index:number) => (
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
          <Button type="button" onClick={handleAddDestination} color="primary">
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
  );
}
