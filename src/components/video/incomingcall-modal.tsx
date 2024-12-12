import User from "@/interfaces/user";
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
interface IncommingCallModalProps {
  answerCall: () => void;
  isCallModalVisible: boolean;
  reciever: User | null;
  rejectIncomingCall:()=>void
}
export default function IncommingCallModal({answerCall, isCallModalVisible, reciever,rejectIncomingCall}: IncommingCallModalProps) {
  return (
    <Modal isOpen={isCallModalVisible} onClose={rejectIncomingCall}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <Avatar
            src={(reciever?.profile_picture as string) || "/logos/avatar.avif"}
            name={reciever?.username}
            size="lg"
          />
          <h3 className="ms-4 text-xl font-semibold">
            Incoming Call from {reciever?.username || "Unknown"}
          </h3>
        </ModalHeader>
        <ModalBody>
          <p>Do you want to accept the call?</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={answerCall} color="success">
            Accept
          </Button>
          <Button onClick={rejectIncomingCall} color="danger">
            Reject
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
