import React, { useState, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Avatar,
  Badge,
  CircularProgress
} from "@nextui-org/react";
import { HiUserGroup } from "react-icons/hi";
import { FaFaceSadTear } from "react-icons/fa6";
import { UserAPIs } from "../APIcalls/UserAPIs";
import _ from "lodash";

import { useForm } from "react-hook-form";
import groupChatAPIs from "../APIcalls/groupChatAPIs";

function CreateGroup({ onGroupCreated }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);
  const [existingUsers, setExistingUsers] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [name, setName] = useState("");
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const userAPIInstance = new UserAPIs();

  const debounceSearch = useCallback(
    _.debounce(async (name) => {
      if (name) {
        try {
          const response = await userAPIInstance.suggestUser({ name });
          // console.log("Suggested users:", response.data);
          setExistingUsers(response.data);
          // return response.data;
        } catch (error) {
          if (error?.response?.status === 401) {
            window.location.href = "/login";
            return;
          }
          console.error("Error while searching for contacts:", error);
        }
      }
    }, 500),
    []
  );

  const handleSuggestedUser = (user) => {
    setName("");

    const alreadyAdded = groupMembers.some(
      (member) => member.mobileNo === user.mobileNo
    );

    if (alreadyAdded) return;

    setGroupMembers([...groupMembers, user]);
  };

  const handleImageChange = (e) => {
    console.log("Image changed");
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleOpen = (backdrop) => {
    onOpen();
  };

  const handleSearch = (e) => {
    const userInput = e.target.value;

    setName(userInput);
    debounceSearch(userInput);
  };

  const createGroup = async (chatData) => {
    try {
      setLoading(true);
      const groupMembersIds = groupMembers.map((member) => member._id);
      const response = await groupChatAPIs.createGroup({ ...chatData, groupMembersIds })
      if (response) {
        console.log("Created group:", response);

        setLoading(false);
        onClose();
        setSelectedImage(null);
        setExistingUsers([]);
        setGroupMembers([]);
        setName("");

        window.location.reload();
        return;
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (error?.response?.status === 401) {
        window.location.href = "/login";
        return;
      }

      console.log("ERR:", error);
    }
  };

  return (
    <>
      {loading && <CircularProgress label="Creating group..." size="lg" className="absolute left-[50%] top-[50%] z-10 text-white" />}
      <div className="flex shrink-0 items-center">
        <Button
          key="opaque"
          variant="flat"
          // color='primary'
          onPress={() => handleOpen()}
          className="h-9 rounded-lg border border-blue-500/40 bg-blue-600 px-3 font-myFont text-sm font-semibold capitalize text-white shadow-sm hover:bg-blue-500 md:px-4"
        >
          Create group
        </Button>
      </div>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onClose={onClose}
        className="dark text-foreground"
      >
        <form action="" onSubmit={handleSubmit(createGroup)}>
          <ModalContent className="w-[92vw] max-w-lg border border-slate-800 bg-[#0f172a] px-1 text-white shadow-2xl">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 px-5 pb-2 pt-5 font-myFont text-xl font-semibold">
                  Create groupchat
                </ModalHeader>
                <ModalBody className="px-5 py-3">
                  <div className="flex w-full justify-center pb-3">
                    <label className="relative">
                      {selectedImage ? (
                        <Avatar
                          src={selectedImage}
                          className="h-20 w-20 text-large ring-1 ring-slate-700"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-700 bg-[#111827]">
                          <span className="text-center text-sm text-slate-400">
                            Add group icon
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        id="chatIcon"
                        name="photo"
                        accept="image/*"
                        required
                        // onChange={handleImageChange}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"

                        // {...register("chatIcon", { required: true })}

                        {...register("chatIcon", {
                          required: true,
                          onChange: (e) => {
                            // Custom onChange logic
                            const file = e.target.files[0];
                            if (file) {
                              const imageUrl = URL.createObjectURL(file);
                              setSelectedImage(imageUrl);  // Preview or other custom logic
                            }
                          }
                        })}
                      />
                    </label>
                  </div>

                  <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-700 bg-[#020617] px-3">
                    <HiUserGroup size={24} className="text-blue-400" />
                    <input
                      type="text"
                      placeholder="Group name"
                      className="h-full w-full bg-transparent font-myFont text-base font-normal text-white placeholder:text-slate-500 focus:outline-none"
                      id="groupName"
                      {...register("groupName", { required: true })}

                    />
                  </div>

                  <div className="mt-3 flex h-12 items-center gap-3 rounded-xl border border-slate-700 bg-[#020617] px-3">
                    <HiUserGroup size={24} className="text-blue-400" />
                    <input
                      type="text"
                      placeholder="Description"
                      className="h-full w-full bg-transparent font-myFont text-base font-normal text-white placeholder:text-slate-500 focus:outline-none"
                      id="description"
                      {...register("description", { required: true })}

                    />
                  </div>

                  <div className="mt-3 flex h-12 items-center gap-3 rounded-xl border border-slate-700 bg-[#020617] px-3">
                    <HiUserGroup size={24} className="text-blue-400" />
                    <input
                      type="text"
                      value={name}
                      placeholder="Search for contacts"
                      className="h-full w-full bg-transparent font-myFont text-base font-normal text-white placeholder:text-slate-500 focus:outline-none"
                      onChange={handleSearch}
                    />
                  </div>

                  {name && (
                    <div className="absolute left-6 top-24 z-10 h-64 w-[calc(100%-3rem)] overflow-y-auto rounded-2xl border border-slate-800 bg-[#0f172a] p-2 pb-10 text-white shadow-2xl sm:w-72">
                      <ul className="mx-1">
                        {existingUsers.length === 0 ? (
                          <div className="my-auto flex h-full w-full flex-col items-center content-center pt-16">
                            <h1 className="my-auto flex font-myFont text-xl text-slate-400">
                              No users found
                            </h1>
                            <FaFaceSadTear
                              size={80}
                              className="flex text-slate-500"
                            />
                          </div>
                        ) : (
                          existingUsers.map((user) => {
                            return (
                              <li
                                className="mt-2 flex h-14 w-full cursor-pointer items-center rounded-xl p-2 transition hover:bg-[#111827]"
                                key={user?.mobileNo}
                                onClick={() => handleSuggestedUser(user)}
                              >
                                <Avatar
                                  src={user?.avatar}
                                  alt="Profile pic"
                                  size="md"
                                />
                                <div className="mx-1 flex w-full justify-between px-3">
                                  <div className="mt-1 min-w-0">
                                    <h1 className="text-md truncate font-myFont font-normal text-slate-100">
                                      {user?.fullName}
                                    </h1>
                                  </div>
                                </div>
                              </li>
                            );
                          })
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="mt-3 flex h-16 w-full items-center gap-3 overflow-x-auto rounded-xl border border-slate-800 bg-[#020617]/40 px-3">
                    <ul className="flex gap-3">
                      {groupMembers &&
                        groupMembers.map((member) => {
                          return (
                            <li key={member.mobileNo}>
                              <Badge
                                content="X"
                                color="default"
                                className="cursor-pointer"
                                onClick={() => {
                                  setGroupMembers(
                                    groupMembers.filter(
                                      (Clickedmember) =>
                                        Clickedmember.mobileNo !==
                                        member.mobileNo
                                    )
                                  );
                                }}
                              >
                                <Avatar radius="lg" src={member.avatar} className="ring-1 ring-slate-700" />
                              </Badge>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </ModalBody>
                <ModalFooter className="px-5 pb-5 pt-2">
                  <Button color="danger" variant="light" onPress={onClose}
                    className="rounded-xl text-slate-300 hover:bg-slate-800"
                    onClick={() => {
                      setSelectedImage(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" className="rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-500">
                    Create
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}

export default CreateGroup;
