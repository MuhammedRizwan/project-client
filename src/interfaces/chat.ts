import User from "./user";

export default interface Chat {
  _id: string;
  participants: string[] | User[];
  messages: string[] | Message[];
  lastMessage: string | Message;
}
export interface Message {
  _id?: string;
  chatId?: string;
  senderId?: string;
  message: string;
  isRead?: boolean;
  message_type?: string;
  message_time: Date;
}
