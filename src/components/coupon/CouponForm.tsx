import { apply_coupon, fetch_unblocked_coupon } from "@/config/user/couponservice";
import Coupon from "@/interfaces/coupon";
import { Image, Input } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CouponListModal from "./CouponModal";
import User from "@/interfaces/user";
import Package from "@/interfaces/package";
import { useRouter } from "next/navigation";

interface CouponFormProps {
        packageData: Package|null;
        totalPrice: number;
        user: User | null;
        discount: number;
        setCouponId: (couponId: string) => void;
        setDiscount: (discount: number) => void;
    }

export function CouponForm({
    packageData,
    totalPrice,
    user,
    discount,
    setCouponId,
    setDiscount
  }: CouponFormProps) {
    const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [coupons, setCoupons] = useState<Coupon[] | null>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        const fetchCoupon = async () => {
          const respone = await fetch_unblocked_coupon();
          const { coupons } = respone;
          setCoupons(coupons);
        };
        fetchCoupon();
      }, []);

    const applyCoupon = async (coupon: Coupon) => {
        try {
          const userId=user?._id
          const response = await apply_coupon(coupon._id,userId,totalPrice,);
          if (response.success) {
            const { discountAmount } = response;
            setDiscount(Number(discountAmount));
            setCouponCode(coupon.coupon_code);
            setCouponId(coupon._id as string);
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
                className="px-4 py-2 bg-orange-500 text-black rounded-md hover:bg-orange-600"
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
                    className="mr-2 mb-2 px-3 py-1 bg-orange-500 text-black rounded-md hover:bg-orange-600"
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
    )}