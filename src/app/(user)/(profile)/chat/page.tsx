import ChatBox from "@/components/chat/Chatbox";
import ChatSidebar from "@/components/chat/ChatSidebar";


export default function ChatApp() {
  return (
    <div className="flex w-full h-screen bg-gray-100 px-3">
      <ChatSidebar />
      <ChatBox />
    </div>
  )
}