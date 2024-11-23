"use client";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { create_post } from "@/config/user/postservice";
import PostForm from "@/components/post/PostForm";

export interface Createpost {
  user_id: string;
  images: File[];
  caption: string;
  location: string;
}

export default function AddPost() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const onSubmit = async (data: Createpost) => {
    try {
      const response = await create_post(data);
      if (response.success) {
        router.push("/user-post");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("cannot create post");
      }
    }
  };

  return <PostForm user={user} onSubmit={onSubmit} />;
}
