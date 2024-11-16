export default interface User {
    _id?:string;
    username?: string;
    lastname?:string;
    email: string;
    phone?: string;
    password: string;
    google_authenticated?:boolean;
    address?:string;
    friends?: string[];
    is_verified?: boolean;
    is_block?: boolean;
    profile_picture?: string|File;
  }