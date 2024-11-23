"use client";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { edit_post, fetch_one_post } from "@/config/user/postservice";
import PostForm from "@/components/post/PostForm";
import { useEffect, useState } from "react";
import Post from "@/interfaces/post";

export interface Createpost {
  user_id: string;
  images: File[];
  caption: string;
  location: string;
}

export default function EditPost({ params }: { params: { postId: string } }) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
    const [post,setPost]=useState<Post|null>(null)
  useEffect(() => {
    const fetch_post =async () => {
      try {
        const response=await fetch_one_post(params.postId)
        if(response.success){
            setPost(response.post)
        }
      } catch (error) {
        throw error;
      }
    };
    fetch_post()
  }, [params.postId]);
  const onSubmit = async (data: Createpost) => {
    try {
      data
      const response = await edit_post(params.postId,);
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

  return <PostForm user={user} onSubmit={onSubmit} post={post}/>;
}
