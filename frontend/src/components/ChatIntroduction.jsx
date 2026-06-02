import React from "react";
import { FaChartPie, FaComments, FaUsers } from "react-icons/fa";

function ChatIntroduction() {
  return (
    <div className="hidden h-full items-center justify-center bg-[#020617] p-8 text-white md:flex">
      <div className="max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-800 bg-[#0f172a] text-3xl text-blue-400 shadow-sm">
          <FaComments />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">Select a conversation</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-400">
          Open a chat to discuss plans, send expense messages and view group expense distribution from one professional workspace.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[{ icon: <FaUsers />, text: "Groups" }, { icon: <FaComments />, text: "Chats" }, { icon: <FaChartPie />, text: "Analytics" }].map((item) => (
            <div key={item.text} className="rounded-xl border border-slate-800 bg-[#0f172a] p-5 shadow-sm">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-[#111827] text-blue-400">{item.icon}</div>
              <p className="font-bold text-slate-200">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatIntroduction;
