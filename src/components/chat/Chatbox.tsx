'use client'
import { useState } from 'react'
import { ScrollShadow, Input, Button, Avatar } from "@nextui-org/react"
import { Paperclip, Smile, Send } from 'lucide-react'

const messages = [
  { id: 1, sender: 'Alice', content: 'Hey, how are you?', timestamp: '10:00 AM' },
  { id: 2, sender: 'You', content: "I'm doing great, thanks! How about you?", timestamp: '10:05 AM' },
  { id: 3, sender: 'Alice', content: "I'm good too. Did you finish the project?", timestamp: '10:10 AM' },
  { id: 4, sender: 'You', content: "Yes, I just wrapped it up. I'll send you the details soon.", timestamp: '10:15 AM' },
  { id: 5, sender: 'Alice', content: "That's great news! Looking forward to seeing it.", timestamp: '10:20 AM' },
]

export default function ChatBox() {
  const [message, setMessage] = useState('')

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Sending message:', message)
    setMessage('')
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      <div className="bg-navy p-3 border-b border-gray-300">
        <h2 className="text-xl font-semibold text-white">Alice Smith</h2>
      </div>
      <ScrollShadow className="flex-1 p-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex mb-4 ${msg.sender === 'You' ? 'justify-end' : ''}`}>
            {msg.sender !== 'You' && (
              <Avatar
                src="/avatar-1.png"
                name={msg.sender}
                size="sm"
                className="mr-2 shadow-lg"
              />
            )}
            <div className={`rounded-lg p-3 max-w-xs shadow-md ${
              msg.sender === 'You' 
                ? 'bg-navy text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}>
              <p className="text-xs">{msg.content}</p>
              <span className="text-xs text-gray-500 block mt-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}
      </ScrollShadow>
      <form onSubmit={handleSendMessage} className="bg-gray-500 p-4 border-t border-gray-300 flex items-center space-x-2">
        <Button isIconOnly variant="light" aria-label="Attach file" className="bg-white text-navy hover:bg-yellow-100">
          <Paperclip className="h-5 w-5" />
        </Button>
        <Input 
          type="text" 
          placeholder="Type a message" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-white  rounded-lg placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-yellow-600"
          size="sm"
        />
        <Button isIconOnly variant="light" aria-label="Insert emoji" className="bg-white text-navy hover:bg-red-100">
          <Smile className="h-5 w-5" />
        </Button>
        <Button type="submit" isIconOnly color="primary" aria-label="Send message" className="bg-white text-navy hover:bg-red-100">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}
