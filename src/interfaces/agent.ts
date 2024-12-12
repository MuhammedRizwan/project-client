export default interface Agent {
    _id?: string ;
    agency_name?: string;
    email: string;
    phone?: string;
    location:string;
    password: string;
    document?:File;
    DocumentURL?:string;
    is_verified?: boolean;
    admin_verified:string;
    is_block?: boolean;
    profile_picture?: string|File;
    createdAt?:Date
  }