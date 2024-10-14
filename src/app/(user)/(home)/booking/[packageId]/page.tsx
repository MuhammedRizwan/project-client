"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import Package from "@/interfaces/package";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  memberName: string;
  memberAge: number;
  discountCode: string;
  startDate: Date;
}

export default function BookingForm({
  params,
}: {
  params: { packageId: string };
}) {
  const router = useRouter();
  const {user}=useSelector((state:RootState)=>state.user)
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [members, setMembers] = useState<{ name: string; age: number }[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/packages/${params.packageId}`
        );
        const { packageData } = response.data;
        setPackageData(packageData);
        setTotalPrice(packageData.offer_price);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [params.packageId]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BookingData>();

  const onSubmit = async (data: BookingData) => {
    try {
      // Prepare the payload with form data, members, and package ID
      const payload = {
        ...data,
        members,
        packageId: params.packageId,
        userId:user?._id,
        totalPrice,
        discount,
      };

      // Send the data to your backend API
      const response = await axios.post(
        "http://localhost:5000/bookings",
        payload
      );

      if (response.status === 201) {
        console.log("Booking successful:", response.data);
        router.push("/payment"); // Navigate to payment page
      } else {
        alert("Failed to complete booking. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const handleAddMember = (name: string, age: number) => {
    if (packageData) {
      if (members.length >= packageData?.max_person) {
        alert(`Cannot add more than ${packageData?.max_person} members.`);
        return;
      }
      const newMembers = [...members, { name, age }];
      setMembers(newMembers);

      const newTotal = (packageData?.offer_price || 0) * newMembers.length;
      setTotalPrice(newTotal - discount);

      // Clear member input fields
      setValue("memberName", "");
      setValue("memberAge", 0);
    }
  };

  const handleApplyDiscount = (code: string) => {
    let discountValue = 0;
    switch (code) {
      case "FREE100":
        discountValue = 100;
        break;
      case "NEW250":
        discountValue = 250;
        break;
      case "AS500":
        discountValue = 500;
        break;
      default:
        alert("Invalid discount code.");
        return;
    }
    setDiscount(discountValue);
    setTotalPrice((prevTotal) => Math.max(0, prevTotal - discountValue));
    setValue("discountCode", code);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Book Now</h1>
      <p className="text-gray-600 mb-6">
        Please fill out the form below to book your trip.
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
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
                  {...register("firstName", {
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
                  {(errors.firstName && errors.firstName.message) || ""}
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
                  {...register("lastName", {
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
                  {(errors.lastName && errors.lastName.message) || ""}
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
                      value:
                        /^\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
                      message: "Invalid phone number format",
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="memberName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="memberName"
                  className="w-full p-2 border rounded-md"
                  placeholder="Input your First Name in Here"
                  {...register("memberName", {
                    required: "Member name is required",
                    maxLength: {
                      value: 30,
                      message: "Member name cannot exceed 30 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s.]+$/,
                      message: "Only letters, spaces, and periods are allowed",
                    },
                  })}
                />
                <p className="text-red-500  text-xs min-h-[20px]">
                  {(errors.memberName && errors.memberName.message) || ""}
                </p>
              </div>
              <div>
                <label
                  htmlFor="memberAge"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Age
                </label>
                <input
                  type="text"
                  id="memberAge"
                  className="w-full p-2 border rounded-md"
                  placeholder="Input your Age in Here"
                  {...register("memberAge", {
                    required: "Member age is required",
                    valueAsNumber: true,
                    min: {
                      value: 4,
                      message: "Member must be at least 4 years old",
                    },
                    max: {
                      value: 100,
                      message: "Member age cannot exceed 100 years",
                    },
                    validate: {
                      isNumber: (value) =>
                        !isNaN(value) || "Age must be a number",
                    },
                  })}
                />
                <p className="text-red-500  text-xs min-h-[20px]">
                  {(errors.memberAge && errors.memberAge.message) || ""}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                handleAddMember(
                  String(getValues("memberName")),
                  Number(getValues("memberAge"))
                )
              }
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              Add
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
                  className="w-full p-2 border rounded-md"
                  {...register("startDate", {
                    required: "Start date is required",
                  })}
                />
                <p className="text-red-500  text-xs min-h-[20px]">
                  {(errors.startDate && errors.startDate.message) || ""}
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Continue to Payment
          </button>
        </form>

        <div className="w-full md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Image
              src={packageData?.images[0] || ""}
              alt="Brazil, Iguazu waterfall"
              width={300}
              height={200}
              className="w-full rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">
              {packageData?.destinations.join(", ")}
            </h2>
            <div className="flex justify-between items-center mb-4">
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                onClick={() => {
                  router.push(`/packages/${packageData?._id}`);
                }}
              >
                Details
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-600">Start From</p>
                <p className="text-xl font-bold">
                  ₹{packageData?.offer_price}
                  <span className="text-sm font-normal">/person</span>
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">Discount / promotion</h3>
            <input
              type="text"
              name="discountCode"
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Type Discout code"
            />
            {["FREE100", "NEW250", "AS500"].map((code) => (
              <button
                key={code}
                onClick={() => handleApplyDiscount(code)}
                className="mr-2 mb-2 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                {code}
              </button>
            ))}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md mt-10">
            <h1 className="text-2xl font-bold mb-2">Total Cost Summary</h1>
            <div className="flex justify-between text-lg mb-2">
              <span>Total Price:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-lg mb-2">
              <span>Discount:</span>
              <span>- ₹{discount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-lg mb-2">
              <span>Admin Fee (5%):</span>
              <span>₹{(totalPrice * 0.05).toFixed(2)}</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-bold text-xl">
              <span>Final Amount:</span>
              <span>₹{(totalPrice - discount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
