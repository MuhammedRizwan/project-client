"use client";

import { RootState } from "@/store/store";
import { RefObject} from "react";
import { useSelector } from "react-redux";
import { Button } from "@nextui-org/react";

interface VideoCallProps {
  myVideoRef: RefObject<HTMLVideoElement>;
  peerVideoRef: RefObject<HTMLVideoElement>;
  isCallAccepted: boolean;
  endCall: () => void;
}

export default function VideoCall({
  myVideoRef,
  peerVideoRef,
  isCallAccepted,
  endCall,
}: VideoCallProps) {
  const user = useSelector((state: RootState) => state.user.user);
  console.log(myVideoRef,"myvideo reference")
  console.log(peerVideoRef,"peervideo ref")
  return (
    <div className=" w-full flex flex-col h-screen bg-navy">
      <div className="flex-grow flex">
        <div className="w-1/2 p-4 flex flex-col">
          <h3 className="text-center text-white mb-2">My Video</h3>
          <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-lg border-2 border-white"
          />
        </div>
        <div className="w-1/2 p-4 flex flex-col">
          <h3 className="text-center text-white mb-2">
            {isCallAccepted ? "Peer Video" : "Waiting for peer..."}
          </h3>
          {isCallAccepted ? (
            <video
              ref={peerVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-lg border-2 border-white"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 rounded-lg border-2 border-white flex items-center justify-center">
              <p className="text-white text-xl">Waiting for peer to join...</p>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 flex justify-center items-center">
        <p className="text-white mr-4">
          My ID: <span className="font-semibold">{user?._id}</span>
        </p>
        {isCallAccepted && (
          <Button 
            color="danger" 
            onClick={endCall}
            className="px-6 py-2"
          >
            End Call
          </Button>
        )}
      </div>
    </div>
  );
}


