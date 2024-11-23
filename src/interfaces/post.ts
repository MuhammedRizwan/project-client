import User from "./user";

interface Like {
  liked_user: string; 
  emoji?: string; 
  created_At?: Date; 
}

interface Comment {
    _id?:string
  user_id: string|User;
  message: string;
  created_At?: Date; 
}


export default interface Post {
  createdAt: Date;
  _id: string; 
  user_id: string|User;
  image?: string[]|File[]; 
  caption: string; 
  location: string;
  like: Like[]; 
  comment: Comment[];  
}

