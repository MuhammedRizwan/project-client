import { Input, Avatar, ScrollShadow } from "@nextui-org/react"

const contacts = [
  { id: 1, name: "Alice Smith", avatar: "/avatar-1.png", lastMessage: "Hey, how are you?" },
]

export default function ChatSidebar() {
  return (
    <div className="w-64 bg-content1 border-r border-divider flex flex-col">
      <div className="p-3 border-b border-divider bg-navy">
        <Input 
          placeholder="Search contacts..." 
          size="sm"
          variant="bordered"
          className="w-full  bg-white  rounded-lg placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-yellow-600"
        />
      </div>
      <ScrollShadow className="flex-grow">
        {contacts.map((contact) => (
          <div key={contact.id} className="p-4 hover:bg-content2 cursor-pointer transition-colors">
            <div className="flex items-center space-x-4">
              <Avatar
                src={contact.avatar}
                name={contact.name}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{contact.name}</p>
                <p className="text-xs text-foreground-500 truncate">{contact.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}
      </ScrollShadow>
    </div>
  )
}

