import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelBookingModal = ({ isOpen, onClose, onConfirm }: CancelBookingModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} className="max-w-md max-h-3xl">
    <ModalContent>
      <ModalHeader>Cancel Booking</ModalHeader>
      <ModalBody>
        <p>Are you sure you want to cancel this booking?</p>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={onConfirm}>Yes, Cancel</Button>
        <Button color="primary" onClick={onClose}>No, Keep it</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
