"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardHeader,
  CardBody,
} from "@nextui-org/react";
import Coupon from "@/interfaces/coupon";

interface CouponListModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupons: Coupon[];
  applyCoupon: (coupon: Coupon) => void;
}

export default function CouponListModal({
  isOpen,
  onClose,
  coupons,
  applyCoupon,
}: CouponListModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      size="lg"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              All Coupons
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((coupon) => (
                  <Card
                    key={coupon._id}
                    className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardHeader
                      className="flex gap-4 items-center bg-blue-50 p-4 rounded-t-lg cursor-pointer"
                      onClick={() => applyCoupon(coupon)}
                    >
                      <div className="flex flex-col">
                        <p className="text-xl font-semibold text-blue-800">
                          {coupon.coupon_code}
                        </p>
                        <p className="text-sm text-gray-600">
                          {coupon.percentage}% off
                        </p>
                      </div>
                    </CardHeader>
                    <CardBody className="p-4 bg-white">
                      <p className="text-gray-700">{coupon.description}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
