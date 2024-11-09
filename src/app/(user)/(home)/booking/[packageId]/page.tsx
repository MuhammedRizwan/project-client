"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Package from "@/interfaces/package";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import toast from "react-hot-toast";
import Script from "next/script";
import { Button } from "@nextui-org/react";
import { booking, create_order, verify_order } from "@/api/user/bookingservice";
import { fetch_one_package } from "@/api/user/packageservice";
import {
  BookingData,
  RazorpayOptions,
  RazorpayResponse,
} from "@/interfaces/booking";
import { CouponForm } from "@/components/coupon/CouponForm";
import BookingFormUser from "@/components/booking/BookingForm";

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
  const [couponId, setCouponId] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch_one_package(params.packageId);
        const { packageData } = response;
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
        payment_status: "pending",
      };
      const response = await create_order({
        amount: (totalPrice - discount) * 100,
      });
      if (!response) throw new Error("Failed to create order");

      const data = await response.order;
      const paymentData: RazorpayOptions = {
        key: process.env.RAZORPAY_KEY_ID as string,
        order_id: data.id,
        handler: async (response: RazorpayResponse) => {
          const res = await verify_order({
            orderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          const data = await res;
          if (data.successpayment) {
            const response = await booking(payload);
            if (response.success) {
              router.push(`/payment/${response.booking._id}`);
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

  return (
    <div className="container mx-auto p-4">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <h1 className="text-3xl font-bold mb-4">Book Now</h1>
      <p className="text-gray-600 mb-6">
        Please fill out the form below to book your trip.
      </p>
      <div className="flex flex-col md:flex-row gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
          <BookingFormUser
            packageData={packageData}
            members={members}
            setMembers={setMembers}
            setTotalPrice={setTotalPrice}
            errors={errors}
            register={register}
          />
          <Button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            isLoading={loading}
          >
            Continue to Payment
          </Button>
        </form>
        <CouponForm
          packageData={packageData}
          setCouponId={setCouponId}
          discount={discount}
          setDiscount={setDiscount}
          totalPrice={totalPrice}
          user={user}
        />
      </div>
    </div>
  );
}
