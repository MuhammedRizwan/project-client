'use client'
import UserProfile from "@/components/profile/UserProfile";
import axiosInstance from "@/lib/axiosInstence";
import { RootState } from "@/store/store";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function ProfileEdit(){
    const userData=useSelector((state:RootState)=>state.user.user)
    const [user,setUser]=useState()
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await axiosInstance.get(`/profile/${userData?._id}`);
            if (response.status === 200) {
              const { user } = response.data;
              setUser(user)
            }
          } catch (error) {
            if (axios.isAxiosError(error)) {
              toast.error(error.response?.data.message);
            }
          }
        };
        fetchUserData();
      }, [userData?._id]);
    
    
    return(
        user &&
        <UserProfile user={user} />
    )
}