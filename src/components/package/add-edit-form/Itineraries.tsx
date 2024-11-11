"use client";
import { Button, Input } from "@nextui-org/react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Activity, Itinerary, PackageFormValues } from "@/interfaces/package";
import { useState } from "react";

interface ItinerariesProps {
  register: UseFormRegister<PackageFormValues>;
  errors: FieldErrors<PackageFormValues>;
  setValue: UseFormSetValue<PackageFormValues>;
  itineraries: Itinerary[];
  setItineraries: (itineraries: Itinerary[]) => void;
}

export default function Itineraries({
  register,
  errors,
  setValue,
  itineraries,
  setItineraries,
}: ItinerariesProps) {
  const [activityError, setActivityError] = useState<string>("");
  const [errorMessages, setErrorMessages] = useState<string[][]>([]);

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
      setActivityError(`Cannot remove the first activity for Day ${dayIndex + 1}`);
      return;
    }

    const updatedItineraries = [...itineraries];
    updatedItineraries[dayIndex].activities.splice(activityIndex, 1);
    setItineraries(updatedItineraries);
    setValue("itineraries", updatedItineraries);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-8">
      <h1 className="text-2xl font-bold mb-4">Itineraries</h1>
      <p className="text-gray-600 mb-4">Add activities for each day.</p>
      {itineraries.map((itinerary: Itinerary, dayIndex: number) => (
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
                      `itineraries.${dayIndex}.activities.${activityIndex}.time`,
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
                  {errors.itineraries?.[dayIndex]?.activities?.[activityIndex]
                    ?.time && (
                    <p className="text-red-500 text-xs mt-1">
                      {
                        errors.itineraries[dayIndex].activities[activityIndex].time
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
                    {...register(
                      `itineraries.${dayIndex}.activities.${activityIndex}.activity`,
                      {
                        required: "Activity description is required",
                        onChange(e) {
                          handleInputChange(
                            dayIndex,
                            activityIndex,
                            "activity",
                            e.target.value
                          );
                        },
                      }
                    )}
                  />
                  {errors.itineraries?.[dayIndex]?.activities?.[activityIndex]
                    ?.activity && (
                    <p className="text-red-500 text-xs mt-1">
                      {
                        errors.itineraries[dayIndex].activities[activityIndex].activity
                          ?.message
                      }
                    </p>
                  )}
                </div>
                {/* Remove Button */}
                <Button
                  color="danger"
                  onClick={() => handleRemoveActivity(dayIndex, activityIndex)}
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
  );
}
