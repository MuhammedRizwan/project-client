export default interface Chat {
    _id:string
    participants: string[];
    messages: string[]|Message[];
    lastMessage:string|Message; 
  }
  export interface Message {
    _id:string
    chatId: string;
    senderId: string;
    message: string;
    message_type: string;
    message_time:Date
  }