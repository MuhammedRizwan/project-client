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
import { booking, create_order, verify_order } from "@/config/user/bookingservice"; // Import wallet payment
import { fetch_one_package } from "@/config/user/packageservice";
import { BookingData, RazorpayOptions, RazorpayResponse } from "@/interfaces/booking";
import { CouponForm } from "@/components/coupon/CouponForm";
import BookingFormUser from "@/components/booking/BookingForm";
import { useSocket } from "@/components/context/socketContext";
import { wallet_payment } from "@/config/user/walletservice";
import axios from "axios";

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
  const { socket } = useSocket();
  const { user } = useSelector((state: RootState) => state.user);
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [members, setMembers] = useState([{ name: "", age: "" }]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [couponId, setCouponId] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'wallet'>('razorpay'); // Track selected payment method

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
        payment_method:paymentMethod
      };

      if (paymentMethod === 'razorpay') {
        // Razorpay payment flow
        const response = await create_order({
          amount: (totalPrice - discount) * 100,
        });
        if (!response) throw new Error("Failed to create order");

        const data = await response.order;
        const paymentData: RazorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
          order_id: data.id,
          handler: async (response: RazorpayResponse) => {
            const res = await verify_order({
              orderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            const data = await res;
            if (data.successpayment) {
              const bookingResponse = await booking(payload);
              if (bookingResponse.success) {
                if (socket) {
                  const Notification = {
                    heading: "New Booking ",
                    message: `${packageData?.package_name} Booked by ${user?.username} please Confirm the Booking.`,
                    from: user?._id,
                    fromModel: "User",
                    url: `/agent/bookings/${bookingResponse.booking._id}`,
                    to: bookingResponse.booking.travel_agent_id,
                    toModel: "Agent",
                  };
                  socket.emit("to-the-agent", Notification);
                }
                router.push(`/payment/${bookingResponse.booking._id}`);
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
      } else if (paymentMethod === 'wallet') {
        // Wallet payment flow
        const walletResponse = await wallet_payment({
          amount: totalPrice - discount,
          userId: user?._id,
        });
        if (walletResponse.success) {
          const bookingResponse = await booking(payload);
          if (bookingResponse.success) {
            if (socket) {
              const Notification = {
                heading: "New Booking ",
                message: `${packageData?.package_name} Booked by ${user?.username} please Confirm the Booking.`,
                from: user?._id,
                fromModel: "User",
                url: `/agent/bookings/${bookingResponse.booking._id}`,
                to: bookingResponse.booking.travel_agent_id,
                toModel: "Agent",
              };
              socket.emit("to-the-agent", Notification);
            }
            router.push(`/payment/${bookingResponse.booking._id}`);
          } else {
            toast.error("Something went wrong. Please try again later.");
          }
        }
      }
    } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        } else {
          toast.error("Something went wrong with the payment gateway.");
        }
        return;
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
          <div className="mt-4 flex ">
            <div className="mr-4 w-full ">
              <Button
                type="submit"
                onClick={() => setPaymentMethod('razorpay')}
                className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800"
                isLoading={loading}
              >
                Continue to Razorpay Payment
              </Button>
            </div>
            <div className="mr-4 w-full">
              <Button
                type="submit"
                onClick={() => setPaymentMethod('wallet')}
                className="w-full py-3 bg-orange-500 text-black rounded-md hover:bg-orange-600"
                isLoading={loading}
              >
                Continue to Wallet Payment
              </Button>
            </div>
          </div>
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
