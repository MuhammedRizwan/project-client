"use client";
import { useEffect, useRef, useState } from "react";
import {
  ScrollShadow,
  Input,
  Button,
  Avatar,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@nextui-org/react";
import { Paperclip, Smile, Send, Video } from "lucide-react";
import { Message } from "@/interfaces/chat";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getSocket } from "@/lib/socket";
import User from "@/interfaces/user";
import { fetch_room_message } from "@/config/user/chatservice";
import { format } from "date-fns";
interface chatProps {
  roomId: string;
  initiateCall: (recieverId: string | undefined) => void;
  answerCall: () => void;
  isCallModalVisible: boolean;
}
export default function ChatBox({
  roomId,
  initiateCall,
  answerCall,
  isCallModalVisible,
}: chatProps) {
  const user = useSelector((state: RootState) => state.user.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [reciever, setReciever] = useState<User | null>(null);
  const socket = getSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  };
  useEffect(() => {
    if (roomId && user) {
      socket.emit("joined-room", roomId, user._id);
      setMessages([]);
    }
    const fetchRecieverData = async () => {
      const recieverUser = await fetch_room_message(roomId);
      if (recieverUser.success) {
        const { participants, messages } = recieverUser.room;
        const filteredReceiver = participants.find(
          (u: { _id: string }) => u._id !== user?._id
        );

        setReciever(filteredReceiver);
        setMessages(messages);
      }
    };
    fetchRecieverData();
  }, [roomId, socket, user]);

  useEffect(() => {
    socket.on("new-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("new-message");
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const message: Message = {
      senderId: user?._id,
      message: newMessage,
      message_time: new Date(),
    };

    socket.emit("message", { ...message, roomId });
    setNewMessage("");
  };

  const rejectIncomingCall = () => {};

  return (
    <div className="flex flex-col w-full h-full bg-gray-100">
      <div className="bg-navy p-3 border-b border-gray-300 flex ">
        <Avatar
          src={(reciever?.profile_picture as string) || "/logos/avatar.avif"}
          name={reciever?.username}
          size="md"
        />
        <div className="ms-2">
          <p className="text-xl font-semibold text-white mb-0">
            {reciever?.username}
          </p>
          <span className="text-xs text-white">{reciever?.email}</span>
        </div>
        <div className="flex flex-1 flex-row justify-end items-center pe-3">
          <Button onClick={() => initiateCall(reciever?._id)}>
            <Video className="h-7 w-7 text-green-700" />
          </Button>
        </div>
      </div>

      <ScrollShadow
        hideScrollBar
        className="flex-1 p-4 overflow-y-auto bg-gray-50"
      >
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex mb-4 ${
              msg.senderId === user?._id ? "justify-end" : ""
            }`}
          >
            {msg.senderId !== user?._id && (
              <Avatar
                src={
                  (reciever?.profile_picture as string) || "/default-avatar.png"
                }
                name={reciever?.username || "Unknown"}
                size="sm"
                className="mr-2 shadow-lg"
              />
            )}
            <div
              className={`rounded-lg p-3 max-w-xs shadow-md ${
                msg.senderId === user?._id
                  ? "bg-navy text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <span className="text-xs text-gray-500 block mt-1">
                {format(new Date(msg.message_time), "hh:mm a")}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div> {/* Anchor element for scrolling */}
      </ScrollShadow>

      <form
        onSubmit={handleSendMessage}
        className="bg-gray-500 p-4 border-t border-gray-300 flex items-center space-x-2"
      >
        <Button
          isIconOnly
          variant="light"
          aria-label="Attach file"
          className="bg-white text-navy hover:bg-yellow-100"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <Input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-white rounded-lg placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-yellow-600"
          size="sm"
        />
        <Button
          isIconOnly
          variant="light"
          aria-label="Insert emoji"
          className="bg-white text-navy hover:bg-red-100"
        >
          <Smile className="h-5 w-5" />
        </Button>
        <Button
          type="submit"
          isIconOnly
          color="primary"
          aria-label="Send message"
          className="bg-white text-navy hover:bg-red-100"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
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
    </div>
  );
}
