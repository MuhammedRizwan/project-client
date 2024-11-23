import { Createpost } from "@/app/(user)/(profile)/user-post/add-post/page";
import Post from "@/interfaces/post";
import axiosInstance from "@/lib/axiosInstence";

export const create_post = async (data: Createpost) => {
  try {
    console.log(data, "ivade ethiii");
    const response = await axiosInstance.post("/post/create-post", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetch_post = async (userId: string | undefined) => {
  try {
    const response = await axiosInstance.get(`/post/user-post/${userId}`);
    return response.data as {
      success: boolean;
      message: string;
      post: Post[];
    };
  } catch (error) {
    throw error;
  }
};
export const fetch_one_post = async (postId: string | undefined) => {
  try {
    const response = await axiosInstance.get(`/post/one-post/${postId}`);
    return response.data as {
      success: boolean;
      message: string;
      post: Post;
    };
  } catch (error) {
    throw error;
  }
};
export const edit_post = async (
  postId: string | undefined
  // data: Createpost
) => {
  try {
    const response = await axiosInstance.get(`/post/edit-post/${postId}`);
    return response.data as {
      success: boolean;
      message: string;
      post: Post;
    };
  } catch (error) {
    throw error;
  }
};
export const add_post_like = async (
  postId: string | undefined,
  userId: string | undefined
) => {
  try {
    const response = await axiosInstance.put(`/post/add-like/${postId}`, {
      userId,
    });
    return response.data as {
      success: boolean;
      message: string;
      post: Post;
    };
  } catch (error) {
    throw error;
  }
};
export const remove_post_like = async (
  postId: string | undefined,
  userId: string | undefined
) => {
  try {
    const response = await axiosInstance.put(`/post/remove-like/${postId}`, {
      userId,
    });
    return response.data as {
      success: boolean;
      message: string;
      post: Post;
    };
  } catch (error) {
    throw error;
  }
};
export const add_post_comment = async (
  postId: string | undefined,
  userId: string | undefined,
  commentText: string
) => {
  try {
    const response = await axiosInstance.put(`/post/add-comment/${postId}`, {
      userId,
      commentText,
    });
    return response.data as {
      success: boolean;
      message: string;
      post: Post;
    };
  } catch (error) {
    throw error;
  }
};
export const remove_post_comment = async (
  postId: string | undefined,
  userId: string | undefined,
  commentId: string|undefined
) => {
  try {
    const response = await axiosInstance.put(`/post/remove-comment/${postId}/${commentId}`);
    return response.data as {
      success: boolean;
      message: string;
      post: Post;
    };
  } catch (error) {
    throw error;
  }
};

export const fetch_all_post = async () => {
  try {
    const response = await axiosInstance.get("/post/get-all-post");
    return response.data as {
      success: boolean;
      message: string;
      post: Post[];
    };
  } catch (error) {
    throw error;
  }
};
