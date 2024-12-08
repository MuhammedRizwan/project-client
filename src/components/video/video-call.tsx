"use client";

import { RefObject, useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { Volume2, VolumeOff,VolumeX, Video, VideoOff, PhoneOff} from "lucide-react";
import { useSocket } from "../wrapper/socketwrapper";

interface VideoCallProps {
  myVideoRef: RefObject<HTMLVideoElement>;
  peerVideoRef: RefObject<HTMLVideoElement>;
  isCallAccepted: boolean;
  endCall: () => void;
  reciever:string|undefined
}

export default function VideoCall({
  myVideoRef,
  peerVideoRef,
  isCallAccepted,
  endCall,
  reciever
}: VideoCallProps) {
  const {socket} = useSocket();
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [peerAudioMuted,setPeerAudioMuted]=useState(false)

  useEffect(() => {
    if(!socket)return
    socket.on("audio-muted", ({ isMuted }) => {
      setPeerAudioMuted(isMuted)
      if (peerVideoRef.current?.srcObject) {
        const stream = peerVideoRef.current.srcObject as MediaStream;
        stream.getAudioTracks().forEach((track) => {
          track.enabled = isMuted;
        });
      }
    });

    socket.on("video-muted", ({ isMuted }) => {
      if (peerVideoRef.current?.srcObject) {
        const stream = peerVideoRef.current.srcObject as MediaStream;
        stream.getVideoTracks().forEach((track) => {
          track.enabled = isMuted;
        });
      }
    });
    socket.on("video-call-ended", endCall);

    return () => {
      socket.off("audio-muted");
      socket.off("video-muted");
      socket.off("video-call-ended",endCall);

    };
  }, [endCall, peerVideoRef, socket]);

  const toggleAudio = () => {
    if(!socket)return
    if (myVideoRef.current?.srcObject) {
      const stream = myVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioMuted;
      });
      setIsAudioMuted((prev) => {
        const newState = !prev;
        socket.emit("audio-mute", { isMuted: newState, reciever});
        return newState;
      });
    }
  };

  const toggleVideo = () => {
    if(!socket)return
    if (myVideoRef.current?.srcObject) {
      const stream = myVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoMuted;
      });
      setIsVideoMuted((prev) => {
        const newState = !prev;
        socket.emit("video-mute", { isMuted: newState, reciever });
        return newState;
      });
    }
  };

  const handleEndCall=()=>{
    if(!socket)return
    socket.emit("end-video-call", { to: reciever});
    endCall()
  }

  return (
    <div className="w-full flex flex-col h-screen bg-navy relative">
      <div className="flex-grow flex items-center justify-center">
        {isCallAccepted ? (
          <>
          <video
            ref={peerVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {peerAudioMuted && (
            <div className="absolute bottom-4 left-4 flex items-center justify-center bg-black/50 rounded-full p-2">
              <VolumeX size={24} className="text-white" />
            </div>
          )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <p className="text-white text-xl">Waiting for peer to join...</p>
          </div>
        )}
        <div className="absolute top-4 right-4 w-1/4 max-w-[200px] aspect-video">
          <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-lg border-2 border-white"
          />

          {(isAudioMuted) && (
            <div className="absolute inset-0 flex items-end justify-start bg-black/50 rounded-lg">
              <div className="flex space-x-2 text-white">
                {isAudioMuted && <VolumeOff size={16} />}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 flex justify-center items-center space-x-4">
        <Button
          isIconOnly
          color={isAudioMuted ? "warning" : "primary"}
          onClick={toggleAudio}
          className="w-12 h-12 rounded-full"
        >
          {isAudioMuted ? <VolumeOff size={24} /> : <Volume2 size={24} />}
        </Button>
        <Button
          isIconOnly
          color={isVideoMuted ? "warning" : "primary"}
          onClick={toggleVideo}
          className="w-12 h-12 rounded-full"
        >
          {isVideoMuted ? <VideoOff size={24} /> : <Video size={24} />}
        </Button>
        <Button
          isIconOnly
          color="danger"
          onClick={handleEndCall}
          className="w-12 h-12 rounded-full"
        >
          <PhoneOff size={24} />
        </Button>
      </div>
    </div>
  );
}
