import React, { useEffect, useState } from "react";
import CreateGroup from "./CreateGroup";
import conversationAPIs from "../APIcalls/conversations";
import { MdGroups2 } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { loadChats } from "../store/Slices/eventSlice";
import ContactsSkeleton from "./ContactsSkeleton";
import { viewStatus } from "../store/Slices/viewSlice";

function Contacts() {
  const [conversationHistory, setConversationHistory] = useState([]);
  const [loadContacts, setLoadContacts] = useState(false);
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.auth.userData);
  const mobileView = useSelector((state) => state.view.status);
  const activeChat = useSelector((state) => state.event.userEvents);

  useEffect(() => {
    (async () => {
      try {
        setLoadContacts(true)
        const allContacts = await conversationAPIs.getAllConversations();

        if (allContacts) {
          setConversationHistory(allContacts.data);
          setLoadContacts(false)
          // console.log("Contacts:",allContacts)
        }
      } catch (error) {
        console.log("ERR:", error);
        setLoadContacts(false)
      }
    })();
  }, []);

  return (
    <div className={!mobileView ? "flex h-full w-full flex-col overflow-hidden border-r border-slate-800 bg-[#0f172a]" : "hidden h-full overflow-hidden border-r border-slate-800 bg-[#0f172a] md:flex md:w-[35%] md:flex-col"}>
      <div className="flex h-[72px] w-full shrink-0 items-center justify-between border-b border-slate-800 bg-[#0f172a] px-4">
        <h1 className="flex items-center font-myFont text-2xl font-semibold text-white">
          Chats
        </h1>
        <CreateGroup
          onGroupCreated={(newGroup) => {
            setConversationHistory((prev) => [newGroup, ...prev]);
          }}
        />
      </div>

      <div className="w-full flex-1 overflow-y-auto px-3 py-3 text-white">
        <ul className="space-y-2">

          {loadContacts && <ContactsSkeleton />}

          {conversationHistory.map((conversation) => {
            const latestUpdate = new Date(conversation.updatedAt);

            const formatedDate = latestUpdate.toLocaleDateString("en-GB");

            const formattedTime = latestUpdate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });
            //extracting name and avatar of friend's contact
            // let otherMember;
            // if(!conversation.isGroup){
            //   otherMember=conversation.members.find((member)=>member._id !== loggedUser._id)
            // }


            return conversation.isGroup ? (
              <li
                className={`flex min-h-[92px] w-full cursor-pointer items-center rounded-xl border px-3 py-3 transition duration-200 ${activeChat?._id === conversation._id ? "border-blue-500/50 bg-blue-500/10" : "border-slate-800 bg-[#111827] hover:border-slate-700 hover:bg-[#1e293b]"}`}
                key={conversation._id}
                onClick={() => {
                  dispatch(loadChats({ ...conversation, dataType: "contact" }))
                  dispatch(viewStatus())
                }

                }
              >
                <img
                  src={conversation?.chatIcon}
                  alt="Profile pic"
                  className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-slate-700"
                />
                <div className="ml-3 flex min-w-0 flex-1 justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h1 className="truncate font-myFont text-base font-semibold text-white">
                      {conversation.chatName}
                    </h1>
                    <p className="mt-1 truncate font-myFont text-sm text-slate-400">{conversation?.description}</p>
                    <p className="mt-1 font-myFont text-[12px] text-slate-500">
                      New <span className="pl-2">{formattedTime}</span>{" "}
                      <span className="pl-2">{formatedDate}</span>{" "}
                    </p>
                  </div>
                  {conversation.isGroup ? (
                    <MdGroups2 size={22} className="mt-1 shrink-0 text-blue-400" />
                  ) : (
                    <IoPerson size={22} className="mt-1 shrink-0 text-blue-400" />
                  )}
                </div>
              </li>
            ) : (
              <li
                className={`flex min-h-[88px] w-full cursor-pointer items-center rounded-xl border px-3 py-3 transition duration-200 ${activeChat?._id === conversation._id ? "border-blue-500/50 bg-blue-500/10" : "border-slate-800 bg-[#111827] hover:border-slate-700 hover:bg-[#1e293b]"}`}
                key={conversation._id}
                onClick={() => {
                  dispatch(loadChats({ ...conversation, dataType: "contact" }))
                  dispatch(viewStatus())
                }

                }
              >
                <img
                  src={conversation?.chatIcon}
                  alt="Profile pic"
                  className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-slate-700"
                />
                <div className="ml-3 flex min-w-0 flex-1 justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h1 className="truncate font-myFont text-base font-semibold text-white">
                      {conversation.chatName}
                    </h1>
                    <p className="mt-1 font-myFont text-sm text-slate-500">
                      New <span className="pl-2">{formattedTime}</span>{" "}
                      <span className="pl-2">{formatedDate}</span>{" "}
                    </p>
                  </div>
                  {conversation.isGroup ? (
                    <MdGroups2 size={22} className="mt-1 shrink-0 text-blue-400" />
                  ) : (
                    <IoPerson size={22} className="mt-1 shrink-0 text-blue-400" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Contacts;
