'use client'
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useIncomingCall } from "../context/incomingcallContext";
import { useRouter } from "next/navigation";

export default function IncommingCallModal() {
  const { incomingCall } = useIncomingCall();
  const router = useRouter();

  const answerCall = () => {
    router.push(`/video?caller=${incomingCall.from}`);
  };

  const rejectCall = () => {
    incomingCall.isSomeoneCalling=false //want sent back to initail user that user rejected
  };

  if (!incomingCall.isSomeoneCalling) return null;

  return (
    <Modal isOpen={incomingCall.isSomeoneCalling} onClose={rejectCall}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <Avatar
            src={incomingCall.from || "/logos/avatar.avif"}
            name={incomingCall.from}
            size="lg"
          />
          <h3 className="ms-4 text-xl font-semibold">
            Incoming Call from {incomingCall.from || "Unknown"}
          </h3>
        </ModalHeader>
        <ModalBody>
          <p>Do you want to accept the call?</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={answerCall} color="success">
            Accept
          </Button>
          <Button onClick={rejectCall} color="danger">
            Reject
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
