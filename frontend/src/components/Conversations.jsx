import React, { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaMapLocationDot } from "react-icons/fa6";
import { MdOutlineDescription } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import singleChatAPIs from "../APIcalls/singleChatAPIs";
import { chatHistory } from "../store/Slices/chatSlice";
import {
  DatePicker,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import conversationAPIs from "../APIcalls/conversations";
import groupChatAPIs from "../APIcalls/groupChatAPIs";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

import { io } from "socket.io-client"
import { resetStatus } from "../store/Slices/viewSlice";


function Conversations() {
  const currentUser = useSelector((state) => state.auth.userData);
  const safeUser = currentUser || {};

  const socketRef = useRef(null);
  const [simpleMessage, setSimpleMessage] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isGroupInfoOpen,
    onOpen: onGroupInfoOpen,
    onOpenChange: onGroupInfoOpenChange,
  } = useDisclosure();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [allChats, setAllChats] = useState(null);
  const [groupInfo, setGroupInfo] = useState(null);
  const [groupInfoLoading, setGroupInfoLoading] = useState(false);
  const dispatch = useDispatch()
  const items = [
    {
      key: "group",
      label: "Group info",
    },
  ];

  const jsDate = new Date(
    selectedDate?.year,
    selectedDate?.month - 1,
    selectedDate?.day
  );
  const chatData = useSelector((state) => state.event.userEvents);
  const loggedUser = useSelector((state) => state.auth.userData);
  const mobileView = useSelector((state) => state.view.status);


  const navigate = useNavigate();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleGroupInfoOpen = async () => {
    if (!chatData?.isGroup) {
      return;
    }

    const hasPopulatedMembers = chatData?.members?.some(
      (member) => typeof member === "object" && member?.fullName
    );

    if (hasPopulatedMembers) {
      setGroupInfo(chatData);
      onGroupInfoOpen();
      return;
    }

    try {
      setGroupInfoLoading(true);
      onGroupInfoOpen();
      const response = await groupChatAPIs.getGroupDetails(chatData._id);
      setGroupInfo(response.data);
    } catch (error) {
      console.log("Error fetching group info:", error);
      try {
        const memberIds = chatData?.members?.map((member) =>
          typeof member === "object" ? member?._id : member
        );
        const response = await conversationAPIs.getAllMembers(memberIds);
        setGroupInfo({ ...chatData, members: response.data });
      } catch (memberError) {
        console.log("Error fetching group members:", memberError);
        setGroupInfo(chatData);
      }
    } finally {
      setGroupInfoLoading(false);
    }
  };

  //Sending a simple message
  const sendSimpleMessage = async () => {
    const receiver = () => {
      if (chatData.dataType === "navbar") {
        return [chatData._id];
      } else {
        const idArray = chatData?.members?.filter(
          (memberId) => memberId !== loggedUser?._id
        );
        return idArray;
      }
    };

    const receiverArray = receiver();

    const chatDetails = {
      message: simpleMessage,
      receiverArray,
      chatName:
        chatData.dataType === "navbar"
          ? chatData.fullName.trim()
          : chatData.chatName,
    };


    try {
      if (chatData.dataType === "navbar") {
        const response = await singleChatAPIs.sendSimpleChat(chatDetails);
        if (response) {
          console.log("Response for single chat:", response);

          setSimpleMessage("");


        }
      } else {
        if (chatData.members.length > 2) {
          const response = await groupChatAPIs.sendSimpleMessage(chatDetails);

          if (response) {
            console.log("Response from simple group chat:", response);
            setSimpleMessage("");

            //sending new messasge to the server
            socketRef.current.emit("new message", response.data);
            // console.log("message emmited")

          }
        } else {
          const response = await singleChatAPIs.sendSimpleChat(chatDetails);
          if (response) {
            setSimpleMessage("");
          }
        }
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  //sending expense message
  const sendExpenseMessage = async () => {
    const receiver = () => {
      if (chatData.dataType === "navbar") {
        return [chatData._id];
      } else {
        const idArray = chatData?.members?.filter(
          (memberId) => memberId !== loggedUser?._id
        );
        return idArray;
      }
    };

    const receiverArray = receiver();

    const chatDetails = {
      amount,
      description,
      place,
      expenseDate: jsDate,
      chatName:
        chatData.dataType === "navbar"
          ? chatData.fullName.trim()
          : chatData.chatName,
      receiverArray,
    };

    try {
      if (chatData.dataType === 'navbar') {
        const response = await singleChatAPIs.sendExpenseChat(chatDetails);

        if (response) {
          console.log("Response from expense message:", response);
        }

        setAmount("");
        setDescription("");
        setPlace("");
        setSelectedDate(null);
      } else {
        if (chatData.members.length > 2) {
          const response = await groupChatAPIs.sendExpenseMessage(chatDetails);
          if (response) {
            console.log("Response from gc expense message:", response);

            //sending new message to server
            socketRef.current.emit("new message", response.data);
          }
          setAmount("");
          setDescription("");
          setPlace("");
          setSelectedDate(null);
        } else {
          const response = await singleChatAPIs.sendExpenseChat(chatDetails);

          if (response) {
            console.log("Response from expense message:", response);
          }

          setAmount("");
          setDescription("");
          setPlace("");
          setSelectedDate(null);
        }
      }
    } catch (error) {
      console.log("ERR:", error);
    }
  };

  //fetching all chat history

  useEffect(() => {
    // Check if chatData exists (is truthy)
    if (chatData) {
      const loadAllChats = async () => {
        const receiver = () => {
          if (chatData.dataType === "navbar") {
            return [chatData._id];
          } else {
            const idArray = chatData?.members?.filter(
              (memberId) => memberId !== loggedUser?._id
            );
            return idArray;
          }
        };

        const members = receiver();

        const chatName =
          chatData.dataType === "navbar"
            ? chatData.fullName.trim()
            : chatData.chatName;

        try {
          const response = await conversationAPIs.getAllChats({
            members,
            chatName,
          });

          if (response) {
            // setAllChats(response.data);

            //integrating web socket io

            if (!socketRef.current) {

              //for deployment
              //socketRef.current = io("https://fairshare-rw0c.onrender.com",{
              //  withCredentials: true
              //})

              //for development
              socketRef.current = io("http://localhost:8000", {
                withCredentials: true
              })

              socketRef.current.on("connect", () => {
                console.log("user connected:", socketRef.current.id)

                //join group
                socketRef.current.emit("join group", chatData._id)

                //send previous chats to the server
                socketRef.current.emit("previous chats", response.data)

                socketRef.current.on("display chats", (chats) => {
                  setAllChats(chats);

                })
              })

            }




          }
        } catch (error) {
          console.log("ERR:", error);
        }
      };

      // Execute the function when chatData is true
      loadAllChats();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null; // Reset the ref to null
      }
    };


  }, [chatData, loggedUser?._id]);

  // console.log("all chats",allChats)

  // useEffect( ()=>{

  // },[])


  return (
    <div className={mobileView ? "flex h-full w-full flex-col overflow-hidden bg-[#020617] md:flex" : "hidden h-full w-full flex-col overflow-hidden bg-[#020617] md:flex"}>
      <div className="flex h-[72px] w-full shrink-0 items-center justify-between gap-3 border-b border-slate-800 bg-[#0f172a] px-3 shadow-sm md:px-6">
        <div className="flex min-w-0 items-center">
          <IoMdArrowBack size={30} className="my-auto mr-2 flex shrink-0 cursor-pointer text-slate-300 md:hidden"
            onClick={() => dispatch(resetStatus())}
          />
          <Avatar
            isBordered
            src={chatData?.avatar || chatData?.chatIcon}
            className="h-11 w-11 shrink-0 border border-slate-700"
          />
          <h1 className="flex min-w-0 items-center truncate pl-3 font-myFont text-lg font-semibold text-slate-100">
            {chatData?.fullName || chatData?.chatName}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="bordered"
            className="my-auto hidden h-10 rounded-lg border border-slate-700 bg-[#1e293b] px-4 font-myFont text-sm font-semibold text-slate-100 shadow-sm transition hover:border-blue-500/60 hover:bg-slate-700 md:flex"
            onClick={() => {
              dispatch(chatHistory({ chatData, allChats }))
              navigate('/expenseDistribution')
            }}
          >
            View distribution
          </Button>
          <Dropdown className="dark border border-slate-800 bg-[#0f172a] text-slate-100 shadow-xl">
            <DropdownTrigger>
              <Button isIconOnly size="sm" className="my-auto h-10 w-10 rounded-lg border border-slate-700 bg-[#111827] text-slate-200 hover:border-slate-600 hover:bg-[#1e293b]">
                <BsThreeDotsVertical size={22} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Dynamic Actions"
              items={items}
              className="w-full"
            >
              {(item) => (
                <DropdownItem
                  key={item.key}
                  color={item.key === "delete" ? "danger" : "default"}
                  onPress={item.key === "group" ? handleGroupInfoOpen : undefined}
                  className={`${item.key === "delete" ? "text-danger" : ""
                    } rounded-lg text-slate-200 hover:bg-slate-800`}
                >
                  {item.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className="w-full flex-1 overflow-y-auto bg-[#020617]">
        <ul className="mx-auto flex w-full max-w-5xl flex-col px-3 py-4 md:px-6 md:py-6">
          {allChats &&
            allChats?.map((chat) => {
              return chat.messageType === "simpleMessage" ? (

                <li
                  className={`flex pb-4 ${chat?.sender?._id === loggedUser?._id
                    ? "justify-end"
                    : "justify-start"
                    }`}
                  key={chat._id}
                >
                  {chat?.sender?._id !== loggedUser?._id && <Avatar isBordered radius="lg" src={chat?.sender.avatar} className="mt-1 h-8 w-8 shrink-0 border border-slate-700" />}
                  <div
                    className={`ml-2 flex max-w-[82%] flex-col rounded-xl border px-3 py-2 font-myFont text-sm shadow-sm md:max-w-[360px] ${chat?.sender?._id === loggedUser?._id
                      ? "rounded-tr-sm border-blue-500/30 bg-[#1e3a5f] text-slate-50"
                      : "rounded-tl-sm border-slate-800 bg-[#111827] text-slate-100"
                      }`}
                  >
                    <p className="break-words leading-6">{chat.message}</p>
                    <p className={`mt-1 flex justify-end text-[11px] ${chat?.sender?._id === loggedUser?._id ? "text-blue-100/80" : "text-slate-500"}`}>
                      {new Date(chat.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </li>
              ) : (
                <li className={`flex pb-5 ${chat?.sender?._id === loggedUser?._id ? "justify-end" : "justify-start"
                  }`}
                  key={chat._id}
                >
                  {chat?.sender?._id !== loggedUser?._id && <Avatar isBordered radius="lg" src={chat?.sender.avatar} className="mt-1.5 h-8 w-8 shrink-0 border border-slate-700" />}
                  <div className={`ml-2 flex w-full max-w-[92%] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] font-myFont text-slate-100 shadow-sm md:max-w-[420px]
                    ${chat.sender._id === loggedUser._id ? "rounded-tr-sm" : "rounded-tl-sm"
                    }`}>
                    <div className="flex items-center gap-3 border-b border-slate-800 bg-[#0f172a] px-4 py-3 font-bold">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400">
                        <FaIndianRupeeSign size={18} />
                      </div>
                      <p className="text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">{chat.amount}</p>
                    </div>
                    <div className="grid gap-3 px-4 py-3 text-sm text-slate-200 sm:grid-cols-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <FaLocationDot size={16} className="shrink-0 text-blue-400" />
                        <p className="truncate font-semibold">{chat.place}</p>
                      </div>
                      <p className="text-slate-400 sm:text-right">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="border-t border-slate-800 px-4 py-3 text-sm leading-6 text-slate-300">{chat.description}</p>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
      <div className="flex w-full shrink-0 flex-col gap-3 border-t border-slate-800 bg-[#0f172a] px-3 py-3 md:flex-row md:items-center md:px-5">
        <div className="flex h-12 w-full items-center gap-2 rounded-xl border border-slate-700 bg-[#020617] px-3 md:flex-1">
          <input
            type="text"
            placeholder="Send simple chat"
            className="h-full w-full bg-transparent pl-1 font-myFont text-base font-light text-white placeholder:text-slate-500 focus:outline-none"
            value={simpleMessage}
            onChange={(e) => setSimpleMessage(e.target.value)}
          />
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm transition hover:bg-blue-500"
            onClick={sendSimpleMessage}
          >
            <IoSend size={18} />
          </button>
        </div>
        <div className="flex w-full items-center md:w-auto">
          <Button
            onPress={onOpen}
            className="h-12 w-full rounded-xl bg-blue-600 px-6 font-myFont font-semibold text-white shadow-sm hover:bg-blue-500 md:w-44 lg:w-52"
          >
            Send expense
          </Button>
        </div>
        <Modal
          backdrop="opaque"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          motionProps={{
            variants: {
              enter: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              },
              exit: {
                y: -20,
                opacity: 0,
                transition: {
                  duration: 0.2,
                  ease: "easeIn",
                },
              },
            },
          }}
        >
          <ModalContent className="dark border border-slate-800 bg-[#0f172a] text-slate-100 shadow-2xl md:left-60">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 font-myFont text-xl font-bold">
                  Expense Description
                </ModalHeader>
                <ModalBody>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#020617] px-3 py-2">
                    <FaIndianRupeeSign size={22} className="text-blue-400" />
                    <input
                      type="number"
                      placeholder="Amount"
                      className="w-full bg-transparent font-myFont text-3xl font-semibold text-white placeholder:text-slate-500 focus:outline-none"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-700 bg-[#020617] px-3 py-2">
                    <FaMapLocationDot size={22} className="text-blue-400" />
                    <input
                      type="text"
                      placeholder="Place"
                      className="w-full bg-transparent font-myFont text-lg font-light text-white placeholder:text-slate-500 focus:outline-none"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-700 bg-[#020617] px-3 py-2">
                    <MdOutlineDescription size={22} className="text-blue-400" />
                    <input
                      type="text"
                      placeholder="Description"
                      className="w-full bg-transparent font-myFont text-lg font-light text-white placeholder:text-slate-500 focus:outline-none"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="flex h-auto w-full pt-2">
                    <DatePicker
                      label="Date of expense"
                      className="dark mx-auto flex max-w-[284px] rounded-xl text-foreground-50"
                      onChange={handleDateChange}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    className="rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={onClose}
                    className="rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-500"
                    onClick={sendExpenseMessage}
                  >
                    Send
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Modal
          backdrop="opaque"
          isOpen={isGroupInfoOpen}
          onOpenChange={onGroupInfoOpenChange}
          size="2xl"
        >
          <ModalContent className="dark border border-slate-800 bg-[#0f172a] text-slate-100 shadow-2xl">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 border-b border-slate-800 px-5 py-4 font-myFont">
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={groupInfo?.chatIcon || chatData?.chatIcon}
                      className="h-16 w-16 shrink-0 border border-slate-700"
                    />
                    <div className="min-w-0">
                      <h2 className="truncate text-xl font-semibold text-white">
                        {groupInfo?.chatName || chatData?.chatName || "Group info"}
                      </h2>
                      <p className="mt-1 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                        {(groupInfo?.members || chatData?.members || []).length} members
                      </p>
                    </div>
                  </div>
                </ModalHeader>
                <ModalBody className="max-h-[65vh] overflow-y-auto px-5 py-4">
                  {groupInfoLoading ? (
                    <div className="flex h-40 items-center justify-center text-sm text-slate-400">
                      Loading group details...
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(groupInfo?.members || chatData?.members || []).map((member, index) => {
                        const memberKey = member?._id || (typeof member === "string" ? member : index);
                        const isMemberObject = typeof member === "object";

                        return (
                          <div
                            key={memberKey}
                            className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#111827] p-3"
                          >
                            <Avatar
                              src={isMemberObject ? member?.avatar : ""}
                              name={isMemberObject ? member?.fullName : "Member"}
                              className="h-11 w-11 shrink-0 border border-slate-700"
                            />
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate font-myFont text-sm font-semibold text-white">
                                {isMemberObject ? member?.fullName : "Member details unavailable"}
                              </h3>
                              <p className="truncate text-xs text-slate-400">
                                {isMemberObject ? member?.email : member}
                              </p>
                            </div>
                            <p className="hidden shrink-0 text-sm text-slate-300 sm:block">
                              {isMemberObject ? member?.mobileNo : ""}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ModalBody>
                <ModalFooter className="border-t border-slate-800 px-5 py-4">
                  <Button
                    variant="light"
                    onPress={onClose}
                    className="rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

export default Conversations;
