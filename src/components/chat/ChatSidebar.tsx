"use client";

import { getSocket } from "@/lib/socket";
import { Avatar, ScrollShadow, Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import SearchInput from "../searchInput";
import User from "@/interfaces/user";
import { fetch_contacts, fetch_room } from "@/config/user/chatservice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Contact {
  _id: string;
  username?: string;
  email?: string;
  profile_picture?: string | null;
  lastMessage?: string | null;
  participants?: User[];
}



export default function ChatSidebar({
  onSelectRoom,
}: {
  onSelectRoom: (roomId: string) => void;
}) {
  const user=useSelector((state: RootState) => state.user.user);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState("chats");
  // const [chats, setChats] = useState<Contact[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchChatsAndContacts = async () => {
      try {
        // const chatsResponse = await fetch(`/api/chats?search=${searchTerm}`);
        // const chatsData = await chatsResponse.json();
        // setChats(chatsData.chats);

        const contactsResponse = await fetch_contacts(user?._id,searchTerm);
      if(contactsResponse.success){
        setContacts(contactsResponse.users);
      }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchChatsAndContacts();
  }, [searchTerm, user?._id]);

  const handleRoomSelection = async(recieverId: string) => {
    const response=await fetch_room(recieverId,user?._id);
    if(response.success){
      const socket = getSocket();
      socket.emit("join-room", response.room._id);  
      setSelectedRoom(response.room._id);
      onSelectRoom(response.room._id);
    }
  };

  const renderUserList = (users: Contact[]) => {
    return users.map((user) => (
      <div
        key={user._id}
        className={`p-4 cursor-pointer transition-colors ${
          selectedRoom === user._id ? "bg-blue-100" : "hover:bg-content2"
        }`}
        onClick={() => handleRoomSelection(user._id as string)}
      >
        <div className="flex items-center space-x-4">
          <Avatar src={user.profile_picture as string||"/logos/avatar.avif"} name={user.username} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user.username}
            </p>
            {user.lastMessage ?(
              <p className="text-xs text-foreground-500 truncate">
                {user.lastMessage}
              </p>
            ):(
              <p className="text-xs text-foreground-500 truncate">
                {user.email}
              </p>
            )}

          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="w-64 bg-content1 border-r border-divider flex flex-col">
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
      <ScrollShadow className="flex-grow">
        { renderUserList(contacts)}
      </ScrollShadow>
    </div>
  );
}