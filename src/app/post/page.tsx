"use client";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Input,
  Image,
} from "@nextui-org/react";
import {
  Heart,
  MessageCircle,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Post from "@/interfaces/post";
import { fetch_all_post, add_post_like, remove_post_like, add_post_comment } from "@/config/user/postservice";
import User from "@/interfaces/user";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Header from "@/components/home/Header";

export default function PostList(): JSX.Element {
  const user = useSelector((state: RootState) => state.user.user);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch_all_post();
        if (response.success) {
        
          setPosts(response.post);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchData();
  }, []);

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
                    liked_user: user?._id ?? '',
                    created_At: new Date(),
                  }
                ]
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
                like: post.like.filter((like) => like.liked_user !== user?._id) 
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
                    user_id: user?._id ?? `${user?.username}`,
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

  const navigateImage = (postId: string, direction: "next" | "prev"): void => {
    const post = posts?.find((p) => p._id === postId);
    if (post) {
      const currentIndex = currentImageIndex[postId] || 0;
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % (post.image as string[]).length
          : (currentIndex - 1 + (post.image as string[]).length) %
            (post.image as string[]).length;
      setCurrentImageIndex({
        ...currentImageIndex,
        [postId]: newIndex,
      });
    }
  };

  return (
    <>
      <Header />
      <div className="space-y-6 max-w-3xl mx-auto pt-28 ">
        {posts &&
          posts.map((post) => (
            <Card key={post._id} className="w-full">
              <CardHeader className="flex gap-4 items-center">
                <Avatar
                  src={(post.user_id as User).profile_picture as string}
                  alt={(post.user_id as User).username}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold">
                    {(post.user_id as User).username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(post.createdAt, " MMMM d, yyyy")}
                  </p>
                </div>
              </CardHeader>
              <CardBody className="relative">
                <div className="relative w-full">
                  <Image
                    src={
                      (post.image as string[])[
                        currentImageIndex[post._id] || 0
                      ] as string
                    }
                    alt={`Post image ${currentImageIndex[post._id] || 1}`}
                    className="w-full max-h-full object-cover rounded-lg"
                  />
                  {(post.image as string[]).length > 1 && (
                    <>
                      <Button
                        isIconOnly
                        variant="flat"
                        color="default"
                        className="absolute top-1/2 left-2 -translate-y-1/2 z-10"
                        onClick={() => navigateImage(post._id, "prev")}
                      >
                        <ChevronLeft />
                      </Button>
                      <Button
                        isIconOnly
                        variant="flat"
                        color="default"
                        className="absolute top-1/2 right-2 -translate-y-1/2 z-10"
                        onClick={() => navigateImage(post._id, "next")}
                      >
                        <ChevronRight />
                      </Button>
                    </>
                  )}
                </div>
              </CardBody>
              <CardFooter className="flex flex-col items-start space-y-4">
                <div className="flex items-center gap-1">
                  {post.like.some(
                    (like) => like.liked_user.toString() === user?._id
                  ) ? (
                    <Button
                      isIconOnly
                      variant="light"
                      onClick={() => handleRemoveLike(post?._id)}
                    >
                      <Heart
                        className={"text-red-500"}
                      />
                    </Button>
                  ):(
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onClick={() => handleAddLike(post?._id)}
                    >
                      <Heart className="text-gray-500" />
                    </Button>
                  ) }

                  <span className="text-sm">{post.like.length} likes</span>
                  <Button isIconOnly className='bg-black text-white' variant="light">
                    <MessageCircle />
                  </Button>
                  <span className="text-sm">{post.comment.length} comments</span>
                  <p>{post.caption}</p>
                </div>
                <div >
                  {post.comment
                    .slice(0, expandedComments[post._id] ? undefined : 3)
                    .map((comment) => (
                      <div key={comment._id} className="mb-1">
                        <span className="font-semibold">
                          {(comment.user_id as User).username}:{" "}
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
                <div className="flex w-full gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComments[post._id] || ""}
                    onChange={(e) =>
                      handleCommentChange(post._id, e.target.value)
                    }
                    className="flex-grow"
                  />
                  <Button
                    isIconOnly
                    className="bg-black text-white"
                    onClick={() => handleAddComment(post._id)}
                  >
                    <Send />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
      </div>
    </>
  );
}
