"use client";
import { useEffect, useRef, useState } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatBox from "@/components/chat/Chatbox";
import SimplePeer, { Instance, SignalData } from "simple-peer";
import VideoCall from "@/components/video/video-call";
import { getSocket } from "@/lib/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export interface incominCallInfo {
  isSomeoneCalling: boolean;
  from: string;
  signalData: SignalData | string;
}
export default function ChatPage() {
  const socket = getSocket();
  const user = useSelector((state: RootState) => state.user.user);
  const [roomId, setRoomId] = useState<string>("");
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Instance>();
  const [stream, setStream] = useState<MediaStream>();
  const [isCallAccepted, setIsCallAccepted] = useState<boolean>(false);
  const [incominCallInfo, setIncominCallInfo] = useState<incominCallInfo>({
    isSomeoneCalling: false,
    from: "",
    signalData: "",
  });
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [isCallModalVisible, setIsCallModalVisible] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (myVideoRef.current) myVideoRef.current.srcObject = mediaStream;
      })
      .catch((error) => console.error("Error accessing media devices:", error));
    // Setup socket listeners
    socket.on("incomming-video-call", handleIncommingCall);
    socket.on("video-call-ended", destroyConnection);

    return () => {
      // Cleanup listeners
      socket.off("incomming-video-call", handleIncommingCall);
      socket.off("video-call-ended", destroyConnection);
    };
  }, [socket]);

  const initiateCall = (recieverId: string | undefined) => {
    // Assign local stream to `myVideoRef`
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (myVideoRef.current) myVideoRef.current.srcObject = mediaStream;
      })
      .catch((error) => console.error("Error accessing media devices:", error));

    setIsCalling(true);
    if (recieverId) {
      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: stream,
      });
      peer.on("signal", (signalData) => {
        socket.emit("initiate-video-call", {
          to: recieverId,
          signalData,
          myId: user?._id,
        });
      });
      peer.on("stream", (remoteStream) => {
        if (peerVideoRef.current) {
          peerVideoRef.current.srcObject = remoteStream;
        }
      });
      socket.on("accept-video-call", (signalData) => {
        setIsCallAccepted(true);
        peer.signal(signalData);
      });
      connectionRef.current = peer;
    } else {
      alert("Please enter user id");
    }
  };

  const handleIncommingCall = ({
    from,
    signalData,
  }: {
    from: string;
    signalData: SignalData;
  }) => {
    setIncominCallInfo({ isSomeoneCalling: true, from, signalData });
    setIsCallModalVisible(true);
  };
  const answerCall = () => {

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (myVideoRef.current) myVideoRef.current.srcObject = mediaStream;
      })
      .catch((error) => console.error("Error accessing media devices:", error));


    setIsCallAccepted(true);
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answer-video-call", {
        signal: data,
        to: incominCallInfo.from,
      });
    });
    peer.on("stream", (currentStream) => {
      if (peerVideoRef.current) {
        peerVideoRef.current.srcObject = currentStream;
      }
    });
    peer.signal(incominCallInfo.signalData);
    connectionRef.current = peer;
    setIsCallModalVisible(false);
  };

  const endCall = () => {
    socket.emit("end-video-call", { to: incominCallInfo.from });
    destroyConnection();
  };
  const destroyConnection = () => {
    if (connectionRef.current) {
      connectionRef.current.destroy();
      window.location.reload();
    }
  };

  return (
    <div className="h-screen w-full flex mx-3">
      {isCalling == true || isCallAccepted == true ? (
        <VideoCall
          myVideoRef={myVideoRef}
          peerVideoRef={peerVideoRef}
          isCallAccepted={isCallAccepted}
          endCall={endCall}
        />
      ) : (
        <>
          <ChatSidebar onSelectRoom={(id) => setRoomId(id)} />
          <div className="flex-1">
            {roomId ? (
              <ChatBox
                roomId={roomId}
                initiateCall={initiateCall}
                answerCall={answerCall}
                isCallModalVisible={isCallModalVisible}
              />
            ) : (
              <p className="text-center mt-4">
                Select a contact to start chatting.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
