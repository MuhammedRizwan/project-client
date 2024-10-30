"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Package from "@/interfaces/package";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstence";
import Script from "next/script";
import Coupon from "@/interfaces/coupon";
import CouponListModal from "@/components/coupon/CouponModal";
import { Button, Input } from "@nextui-org/react";
import axios from "axios";

interface BookingData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  members: { name: string; age: number }[];
  discountCode: string;
  start_date: Date;
}
interface RazorpayOptions {
  key: string;
  amount?: number;
  currency?: string;
  name?: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

export default function BookingForm({
  params,
}: {
  params: { packageId: string };
}) {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [members, setMembers] = useState([{ name: "", age: "" }]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponId, setCouponId] = useState<string | undefined>("");
  const [discount, setDiscount] = useState<number>(0);
  const [coupons, setCoupons] = useState<Coupon[] | null>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/packages/${params.packageId}`
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
    formState: { errors },
  } = useForm<BookingData>();

  const onSubmit = async (bookingData: BookingData) => {
    setLoading(true);
    try {
      const payload = {
        bill_details: {
          first_name: bookingData.first_name,
          last_name: bookingData.last_name,
          email: bookingData.email,
          phone: bookingData.phone,
          address: bookingData.address,
        },
        members,
        package_id: params.packageId,
        user_id: user?._id,
        coupon_id: couponId,
        start_date: bookingData.start_date,
      };
      const res = await axiosInstance.post("/booking/createOrder", {
        amount: totalPrice * 100,
      });
      if (!res.data) throw new Error("Failed to create order");

      const data = await res.data.order;
      const paymentData: RazorpayOptions = {
        key: process.env.RAZORPAY_KEY_ID as string,
        order_id: data.id,
        handler: async (response: RazorpayResponse) => {
          console.log("Payment Response:", response);
          const res = await axiosInstance.post("/booking/verifyOrder", {
            orderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          const data = await res.data;
          if (data.successpayment) {
            const response = await axiosInstance.post("/booking", payload);
            console.log(response.data);
            if (response.status === 201) {
              console.log("Booking successful:", response.data);
              router.push(`/payment/${params.packageId}`);
            } else {
              toast.error("Something went wrong. Please try again later.");
            }
          } else {
            router.push("/cancel");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };
      const payment = new window.Razorpay(paymentData);
      payment.open();
    } catch (error) {
      toast.error("Order creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    const fetchCoupon = async () => {
      const respone = await axiosInstance.get(`/coupon/unblocked`);
      const { coupons } = respone.data;
      setCoupons(coupons);
    };
    fetchCoupon();
  }, [params.packageId]);

  const applyCoupon = async (coupon: Coupon) => {
    try {
      const response = await axiosInstance.post(`/coupon/used/${coupon._id}`, {
        userId: user?._id,
        totalPrice,
      });
      if (response.status == 200) {
        const { discountAmount } = response.data;
        console.log(discountAmount);
        setDiscount(Number(discountAmount));
        setCouponCode(coupon.coupon_code);
        setCouponId(coupon._id);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data.message);
      } else {
        toast.error("Cannot apply coupon");
      }
    } finally {
      closeModal();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
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
                    className="w-full p-2 border rounded-md"
                    placeholder="Input member's name"
                    value={member.name}
                    onChange={(e) =>
                      handleMemberChange(index, "name", e.target.value)
                    }
                  />
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
                    className="w-full p-2 border rounded-md"
                    placeholder="Input member's age"
                    value={member.age}
                    onChange={(e) =>
                      handleMemberChange(index, "age", e.target.value)
                    }
                  />
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

          <Button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            isLoading={loading}
          >
            Continue to Payment
          </Button>
        </form>

        <div className="w-full md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Image
              src={packageData?.images[0] || ""}
              alt={packageData?.package_name || ""}
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
            <Input
              type="text"
              name="discountCode"
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Type Discout code"
              value={couponCode}
              onClear={() => {
                setCouponCode(""), setCouponId(""), setDiscount(0);
              }}
            />
            {coupons && coupons.length > 0 ? (
              <>
                {coupons.slice(0, 3).map((code) => (
                  <button
                    key={code._id}
                    onClick={() => applyCoupon(code)}
                    className="mr-2 mb-2 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    {code.coupon_code}
                  </button>
                ))}

                {/* Show 'View More' button if more than 3 coupons exist */}
                {coupons.length > 3 && (
                  <button
                    onClick={openModal}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    View More Coupons
                  </button>
                )}

                {/* Modal for remaining coupons */}
                <CouponListModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  coupons={coupons}
                  applyCoupon={applyCoupon}
                />
              </>
            ) : (
              <p className="text-gray-500">No coupons available</p>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md mt-10">
            <h1 className="text-2xl font-bold mb-2">Total Cost Summary</h1>
            <div className="flex justify-between text-lg mb-2">
              <span>Total Price:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            {couponCode && (
              <div className="flex justify-between text-lg mb-2">
                <span>Applied Coupon:</span>
                <p className="text-green-500 bg-green-100 p-1 text-center border text-xs border-green-600">
                  {couponCode}
                </p>
              </div>
            )}

            <div className="flex justify-between text-lg mb-2">
              <span>Discounted Amount:</span>
              <span>- ₹{discount.toFixed(2)}</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-bold text-xl">
              <span>Net Amount:</span>
              <span>₹{(totalPrice - discount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
