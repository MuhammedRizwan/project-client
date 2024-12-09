"use client";

import { Avatar, Badge, ScrollShadow, Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import SearchInput from "../searchInput";
import User from "@/interfaces/user";
import {
  fetch_contacts,
  fetch_room,
  fetch_chats,
} from "@/config/user/chatservice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSocket } from "../context/socketContext";
import { Message } from "@/interfaces/chat";

interface Contact {
  _id: string;
  chatId?: string;
  username?: string;
  profile_picture?: string | null;
  lastMessage?: string | null;
  participants?: User[];
  unReadCount: number;
}

export default function ChatSidebar({
  onSelectRoom,
}: {
  onSelectRoom: (roomId: string) => void;
}) {
  const user = useSelector((state: RootState) => state.user.user);
  const { socket } = useSocket();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("chats");
  const [chats, setChats] = useState<Contact[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?._id) return;

        const chatsResponse = await fetch_chats(user._id, searchTerm);
        if (chatsResponse.success) {
          setChats(chatsResponse.users);
        }

        const contactsResponse = await fetch_contacts(user._id, searchTerm);
        if (contactsResponse.success) {
          const chatUserIds = chatsResponse.users.map(
            (user: Contact) => user._id
          );
          const filteredContacts = contactsResponse.users.filter(
            (contact: Contact) => !chatUserIds.includes(contact._id)
          );
          setContacts(filteredContacts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchTerm, user]);

  useEffect(() => {
    if (!socket) return;
    socket.on("new-badge", (message: Message) => {
      const lastChattedRoom = localStorage.getItem("lastChattedRoom");
      console.log(lastChattedRoom,"lasChatroom",message.chatId)
      if (lastChattedRoom != message.chatId)
        setChats((prev) =>
          prev.map((chat) =>
            chat._id === message.senderId
              ? { ...chat, unReadCount: chat.unReadCount + 1 }
              : chat
          )
        );
    });

    return () => {
      socket.off("new-badge");
    };
  }, [socket]);

  const handleRoomSelection = async (receiverId: string) => {
    const response = await fetch_room(receiverId, user?._id);
    if (response.success) {
      setSelectedRoom(response.room._id);
      onSelectRoom(response.room._id);
      setChats((prev) =>
        prev.map((chat) =>
          chat.chatId === response.room._id ? { ...chat, unReadCount: 0 } : chat
        )
      );
    }
  };

  const renderUserList = (users: Contact[]) => {
    return users.map((user) => (
      <div
        key={user._id}
        className={`p-4 cursor-pointer transition-colors ${
          selectedRoom === user._id ? "bg-blue-100" : "hover:bg-content2"
        }`}
        onClick={() => handleRoomSelection(user._id)}
      >
        <div className="flex items-center space-x-4">
          <Avatar
            src={user.profile_picture || "/logos/avatar.avif"}
            name={user.username}
            radius="sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user.username}
            </p>
            {user.lastMessage && (
              <p className="text-xs text-foreground-500 truncate">
                {user.lastMessage}
              </p>
            )}
          </div>
          <Badge
            color="danger"
            content={user.unReadCount > 0 ? user.unReadCount : null}
            shape="rectangle"
          >
            <span></span>
          </Badge>
        </div>
      </div>
    ));
  };

  return (
    <div className="w-64 bg-content1 border-r border-divider flex flex-col">
      {/* Search and Tabs */}
      <div className="p-3 border-b border-divider bg-navy">
        <SearchInput onSearch={setSearchTerm} />
        <Tabs
          aria-label="Chat options"
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
          className="mt-2"
          fullWidth={true}
        >
          <Tab key="chats" title="Chats" />
          <Tab key="contacts" title="Contacts" />
        </Tabs>
      </div>

      {/* User List */}
      <ScrollShadow className="flex-grow" hideScrollBar>
        {activeTab === "chats"
          ? renderUserList(chats)
          : renderUserList(contacts)}
      </ScrollShadow>
    </div>
  );
}
