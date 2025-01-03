"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Input,
  Image,
} from "@nextui-org/react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  fetch_post,
  add_post_like,
  add_post_comment,
  remove_post_like,
} from "@/config/user/postservice";
import Post from "@/interfaces/post";

export default function PostList() {
  const user = useSelector((state: RootState) => state.user.user);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [imageIndices, setImageIndices] = useState<{ [key: string]: number }>(
    {}
  );
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch_post(user?._id);
        if (response.success) {
          const { post } = response;
          setPosts(post);
          const initialIndices = post.reduce(
            (acc: { [key: string]: number }, p: Post) => {
              acc[p._id as string] = 0;
              return acc;
            },
            {}
          );
          setImageIndices(initialIndices);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [user?._id]);

  const handleAddLike = async (postId: string) => {
    const response = await add_post_like(postId, user?._id);
    if (response.success) {
      setPosts(
        posts!.map((post) =>
          post._id === postId
            ? {
                ...post,
                like: [
                  ...post.like,
                  {
                    liked_user: user?._id ?? "",
                    created_At: new Date(),
                  },
                ],
              }
            : post
        )
      );
    }
  };
  const handleRemoveLike = async (postId: string) => {
    const response = await remove_post_like(postId, user?._id);
    if (response.success) {
      setPosts(
        posts!.map((post) =>
          post._id === postId
            ? {
                ...post,
                like: post.like.filter((like) => like.liked_user !== user?._id),
              }
            : post
        )
      );
    }
  };

 

  
  const handleCommentChange = (postId: string, value: string): void => {
    setNewComments({ ...newComments, [postId]: value });
  };

  const handleAddComment = async(postId: string)=> {
    const commentText = newComments[postId];
    if (commentText && commentText.trim()) {
      const response =await add_post_comment(postId, user?._id, commentText);
      if(response.success){
        setPosts(
          posts!.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  comment: [...post.comment, {
                    user_id: user?._id ?? '',
                    message: commentText,
                    created_At: new Date(),
                  }],
                }
              : post
          )
        );
        setNewComments({ ...newComments, [postId]: "" });
      }
    }
  };

  const toggleExpandComments = (postId: string): void => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };
  const handlePrevImage = (postId: string) => {
    setImageIndices((prevIndices) => ({
      ...prevIndices,
      [postId]: Math.max(0, prevIndices[postId] - 1), // Prevent going below 0
    }));
  };

  const handleNextImage = (postId: string, totalImages: number) => {
    setImageIndices((prevIndices) => ({
      ...prevIndices,
      [postId]: Math.min(totalImages - 1, prevIndices[postId] + 1), // Prevent exceeding array length
    }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-3">
      {posts.map((post) => (
        <Card key={post._id} className="w-full h-auto">
          <CardBody className="px-3">
            <div className="relative w-full h-64">
              {post.image && post.image.length > 0 && (
                <>
                  <Image
                    src={post.image[imageIndices[post._id]] as string}
                    alt="Post content"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {post.image.length > 1 && (
                    <>
                      <Button
                        isIconOnly
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800/50 z-10"
                        onClick={() => handlePrevImage(post._id)}
                        disabled={imageIndices[post._id] === 0}
                      >
                        <ChevronLeft className="text-white" />
                      </Button>
                      <Button
                        isIconOnly
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800/50 z-10"
                        onClick={() =>
                          handleNextImage(
                            post._id,
                            (post.image as unknown as string).length
                          )
                        }
                        disabled={
                          imageIndices[post._id] === post.image.length - 1
                        }
                      >
                        <ChevronRight className="text-white" />
                      </Button>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {post.image.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              imageIndices[post._id] === index
                                ? "bg-white"
                                : "bg-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <p>{post.caption}</p>
            {post.location && (
              <p className="text-gray-500">📍 {post.location}</p>
            )}
          </CardBody>
          <CardFooter className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-3 w-full">
              {post.like.some(
                (like) => like.liked_user.toString() === user?._id
              ) ? (
                <Button
                  isIconOnly
                  variant="light"
                  onClick={() => handleRemoveLike(post?._id)}
                >
                  <Heart className={"text-red-500"} />
                </Button>
              ) : (
                <Button
                  isIconOnly
                  color="danger"
                  variant="light"
                  onClick={() => handleAddLike(post?._id)}
                >
                  <Heart className="text-gray-500" />
                </Button>
              )}
              <span>{post.like?.length || 0} likes</span>
              <Button isIconOnly className="bg-black text-white" variant="light">
                <MessageCircle />
              </Button>
              <span>{post.comment?.length || 0} comments</span>
            </div>
            <div>
              {post.comment
                .slice(0, expandedComments[post._id] ? undefined : 3)
                .map((comment) => (
                  <div key={comment._id} className="mb-1">
                    <span className="font-semibold">
                      {user?.username}:{" "}
                    </span>
                    <span>{comment.message}</span>
                  </div>
                ))}
              {post.comment.length > 3 && (
                <p
                  onClick={() => toggleExpandComments(post._id)}
                  className="text-sm cursor-pointer underline"
                >
                  {expandedComments[post._id] ? "Show less" : "Show more"}
                </p>
              )}
            </div>
            <div className="flex w-full">
              <Input
                placeholder="Add a comment..."
                value={newComments[post?._id as string] || ""}
                onChange={(e) =>
                  handleCommentChange(post._id as string, e.target.value)
                }
                className="flex-grow"
              />
              <Button
                isIconOnly
                className=" ml-2 bg-black text-white"
                onClick={() => handleAddComment(post._id as string)}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
