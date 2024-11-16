import { BookingData } from "@/interfaces/booking";
import Package from "@/interfaces/package";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import toast from "react-hot-toast";

interface BookingFormProps { 
    packageData: Package | null;
    members: { name: string; age: string }[];
    setMembers: React.Dispatch<React.SetStateAction<{ name: string; age: string }[]>>;
    setTotalPrice: React.Dispatch<React.SetStateAction<number>>;  
    errors: FieldErrors<BookingData>; 
    register: UseFormRegister<BookingData>;
}

export default function BookingFormUser({packageData, members, setMembers, setTotalPrice,errors, register}: BookingFormProps) {
    const handleAddMember = () => {
        if (packageData && members.length >= packageData.max_person) {
          toast.error(`You can only add up to ${packageData.max_person} members.`);
          return;
        }
        // Add a new member object with initial empty values
        setMembers([...members, { name: "", age: "" }]);
        if (packageData) {
          setTotalPrice(packageData?.offer_price * members.length);
        }
      };
    
      const handleMemberChange = (index: number, field: string, value: string) => {
        if (field.length > 50) {
          toast.error("Field value cannot exceed 50 characters.");
          return;
        }
        if (!isNaN(Number(value)) && Number(value) > 150) {
          toast.error("Value cannot exceed 150.");
          return;
        }
        const updatedMembers = [...members];
        updatedMembers[index] = { ...updatedMembers[index], [field]: value };
        setMembers(updatedMembers);
        if (packageData) {
          setTotalPrice(packageData.offer_price * members.length);
        }
      };
    return (
        <>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full p-2 border rounded-md"
                  placeholder="First Name"
                  {...register("first_name", {
                    required: "First name is required",
                    maxLength: {
                      value: 50,
                      message: "First name cannot exceed 50 characters", // Adjusted to 50
                    },
                    pattern: {
                      value: /^(?! )[a-zA-Z\s.]+$/,
                      message:
                        "Only letters, spaces, and periods are allowed, and the name cannot start with a space",
                    },
                  })}
                />
                <p className="text-red-500  text-xs min-h-[20px]">
                  {(errors.first_name && errors.first_name.message) || ""}
                </p>
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full p-2 border rounded-md"
                  placeholder="Input your Last Name in Here"
                  {...register("last_name", {
                    required: "Last name is required",
                    maxLength: {
                      value: 50,
                      message: "Last name cannot exceed 30 characters",
                    },
                    pattern: {
                      value: /^(?! )[a-zA-Z\s.]+$/,
                      message: "Only letters, spaces, and periods are allowed,",
                    },
                  })}
                />
                <p className="text-red-500  text-xs min-h-[20px]">
                  {(errors.last_name && errors.last_name.message) || ""}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border rounded-md"
                placeholder="Input your Email Address in Here"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
              />
              <p className="text-red-500  text-xs min-h-[20px]">
                {(errors.email && errors.email.message) || ""}
              </p>
            </div>
            <div className="mt-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <div className="flex">
                <select className="p-2 border rounded-l-md bg-gray-50">
                  <option>+91</option>
                </select>
                <input
                  type="tel"
                  id="phone"
                  className="flex-1 p-2 border-t border-b border-r rounded-r-md"
                  placeholder="Input your Phone Number in Here"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Phone number must be exactly 10 digits",
                    },
                  })}
                />
              </div>
              <p className="text-red-500  text-xs min-h-[20px]">
                {(errors.phone && errors.phone.message) || ""}
              </p>
            </div>
            <div className="mt-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                className="w-full p-2 border rounded-md"
                placeholder="Input your Address in Here"
                {...register("address", {
                  required: "Address is required",
                  maxLength: {
                    value: 100,
                    message: "Address cannot exceed 100 characters",
                  },
                })}
              />
              <p className="text-red-500  text-xs min-h-[20px]">
                {(errors.address && errors.address.message) || ""}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Add Members</h2>

            {members.map((member, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
              >
                <div>
                  <label
                    htmlFor={`memberName-${index}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id={`memberName-${index}`}
                    {...register(`members.${index}.name`, {
                      required: "Name is required",
                      maxLength: {
                        value: 50,
                        message: "Name cannot exceed 50 characters",
                      },
                      pattern: {
                        value: /^[a-zA-Z\s]{1,50}$/,
                        message:
                          "Only letters and spaces are allowed, no special characters",
                      },
                    })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Input member's name"
                    value={member.name}
                    onChange={(e) =>
                      handleMemberChange(index, "name", e.target.value)
                    }
                  />
                  <p className="text-red-500  text-xs min-h-[20px]">
                    {errors?.members?.[index]?.name?.message || ""}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor={`memberAge-${index}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Age
                  </label>
                  <input
                    type="text"
                    id={`memberAge-${index}`}
                    {...register(`members.${index}.age`, {
                      required: "Age is required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Age must be a valid number",
                      },
                      min: {
                        value: 0,
                        message: "Age must be at least 0",
                      },
                      max: {
                        value: 120,
                        message: "Age must be 120 or below",
                      },
                    })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Input member's age"
                    value={member.age}
                    onChange={(e) =>
                      handleMemberChange(index, "age", e.target.value)
                    }
                  />
                  <p className="text-red-500  text-xs min-h-[20px]">
                    {errors?.members?.[index]?.age?.message || ""}
                  </p>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddMember}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              Add Another Member
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  When do you want to start your journey?
                </label>
                <input
                  type="date"
                  id="startDate"
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-2 border rounded-md"
                  {...register("start_date", {
                    required: "Start date is required",
                    validate: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      const oneYearFromToday = new Date();
                      oneYearFromToday.setFullYear(today.getFullYear() + 1);

                      if (selectedDate < today) {
                        return "Date cannot be in the past";
                      }
                      if (selectedDate > oneYearFromToday) {
                        return "Date cannot be more than one year from today";
                      }
                      return true;
                    },
                  })}
                />
                <p className="text-red-500 text-xs min-h-[20px]">
                  {(errors.start_date && errors.start_date.message) || ""}
                </p>
              </div>
            </div>
          </div>
          </>
    )
}