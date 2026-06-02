import { useEffect } from "react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.jsx";
import { UserAPIs } from "../APIcalls/UserAPIs";

export default function ChatsNavbar() {
  const [profileUser, setProfileUser] = useState(null);
  const navigate = useNavigate();
  const userAPIInstance = new UserAPIs();
  const currentUser = useSelector((state) => state.auth.userData);
  const displayUser = profileUser || currentUser;

  const handleLogout = async () => {
    try {
      await userAPIInstance.logout();
      setProfileUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await userAPIInstance.getCurrentUser();
        if (response?.data) setProfileUser(response.data);
      } catch (error) {
        console.log("Current user fetch error:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  return (
    <Navbar
      isBordered
      maxWidth="full"
      className="h-[72px] border-b border-slate-800 bg-[#0f172a] text-white shadow-sm"
      classNames={{ wrapper: "h-[72px] px-4 md:px-6" }}
    >
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4 cursor-pointer gap-3" onClick={() => navigate("/chats")}>
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-[#111827] shadow-sm">
            <AcmeLogo />
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-lg font-bold text-white">FairShare</p>
            <p className="text-xs text-slate-400">Professional dashboard</p>
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" className="items-center gap-3" justify="end">
        <Dropdown placement="bottom-end" className="dark border border-slate-800 bg-[#0f172a] text-white shadow-xl">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="border border-slate-700 transition-transform"
              color="primary"
              name={displayUser?.fullName || "User"}
              size="sm"
              src={displayUser?.avatar || ""}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2" textValue={`Signed in as ${displayUser?.email || ""}`}>
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold text-slate-300">{displayUser?.email || "Loading..."}</p>
            </DropdownItem>
            <DropdownItem key="settings" textValue="My Settings" onClick={() => navigate("/settings")}>My Settings</DropdownItem>
            <DropdownItem key="logout" color="danger" textValue="Log Out" onClick={handleLogout}>Log Out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
