import React from "react";
import Contacts from "../components/Contacts";
import Conversations from "../components/Conversations";
import ChatIntroduction from "../components/ChatIntroduction";
import { useSelector } from "react-redux";
import ChatsNavbar from "../components/ChatsNavbar";

function ChatsPage() {
  const chatStatus = useSelector((state) => state.event.status);

  return (
    <div className="h-screen w-full overflow-hidden bg-[#020617] text-white">
      <ChatsNavbar />
      <div className="flex h-[calc(100vh-72px)] overflow-hidden">
        <Contacts />
        <div className="flex-1 overflow-hidden bg-[#020617]">
          {chatStatus ? <Conversations /> : <ChatIntroduction />}
        </div>
      </div>
    </div>
  );
}

export default ChatsPage;
