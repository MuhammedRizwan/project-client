"use client";
import { useEffect, useRef, useState } from "react";
import { ScrollShadow, Input, Button, Avatar, Image } from "@nextui-org/react";
import { Paperclip, Smile, Send, Video } from "lucide-react";
import { Message } from "@/interfaces/chat";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import User from "@/interfaces/user";
import { fetch_room_message } from "@/config/user/chatservice";
import { format } from "date-fns";

import toast from "react-hot-toast";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import IncommingCallModal from "../video/incomingcall-modal";
import { useSocket } from "../context/socketContext";
import uploadToCloudinary from "@/lib/cloudinary";


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
  const {socket,onlineUsers} = useSocket();
  const isOnline = reciever && reciever._id ? onlineUsers?.includes(reciever?._id) : false;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  };
  useEffect(() => {
    if (roomId && socket) {
      socket.emit("joined-room", roomId);
      setMessages([]);
    }
    const fetchRecieverData = async () => {
      const recieverUser = await fetch_room_message(roomId,user?._id);
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
  }, [roomId, socket, user?._id]);

  useEffect(() => {
    if(!socket)return
    socket.on("new-message", (message: Message) => {
      if(message.senderId==reciever?._id){
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("new-message");
    };
  }, [reciever?._id, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    if(!socket)return
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const message: Message = {
      senderId: user?._id,
      message: newMessage,
      message_time: new Date(),
      message_type: "text",
    };

    socket.emit("message", { ...message, roomId,recieverId:reciever?._id });
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!socket)return
    const file = e.target.files?.[0];
    if (!file) return;
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validImageTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Please upload an image in JPEG, PNG, GIF, or WEBP format."
      );
      return;
    }
    const url = await uploadToCloudinary(file);
    const message: Message = {
      senderId: user?._id,
      message: url,
      message_time: new Date(),
      message_type: "image",
    };

    socket.emit("message", { ...message, roomId });
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const handleEmojiClick = (emojiObject: EmojiClickData): void => {
    setNewMessage((prev) => prev + emojiObject.emoji);
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
          {isOnline && (
                  <p className="text-sm text-green-500">Online</p>
                )}
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
        {messages.length > 0 &&
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex mb-4 ${
                msg.senderId === user?._id ? "justify-end" : ""
              }`}
            >
              {msg.senderId !== user?._id && (
                <Avatar
                  src={
                    (reciever?.profile_picture as string) ||
                    "/default-avatar.png"
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
                {msg.message_type === "image" && (
                  <Image
                    src={msg.message}
                    alt="Image"
                    className="max-w-full h-auto"
                  />
                )}
                {msg.message_type == "text" && (
                  <p className="text-sm">{msg.message}</p>
                )}
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
        <Input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <Button
          isIconOnly
          variant="light"
          aria-label="Attach file"
          onClick={() => fileInput.current?.click()}
          className="bg-white text-navy hover:bg-yellow-100"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <div className="relative">
          {isEmojiPickerVisible && (
            <div className="absolute bottom-12 left-0 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
          <Button
            isIconOnly
            variant="light"
            aria-label="Insert emoji"
            onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}
            className="bg-white text-navy hover:bg-yellow-100"
          >
            <Smile className="h-5 w-5" />
          </Button>
        </div>
        <Input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-white rounded-lg placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-yellow-600"
          size="sm"
        />

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
      <IncommingCallModal
        answerCall={answerCall}
        isCallModalVisible={isCallModalVisible}
        reciever={reciever}
        rejectIncomingCall={rejectIncomingCall}
      />
    </div>
  );
}
