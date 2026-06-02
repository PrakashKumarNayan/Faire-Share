import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.jsx";
import { useNavigate } from "react-router-dom";

function NextuiNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "Features", action: () => window.scrollTo({ top: 680, behavior: "smooth" }) },
    { label: "About", action: () => navigate("/about") },
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      className="fixed top-0 z-50 border-b border-white/10 bg-slate-950/55 text-white backdrop-blur-2xl"
      classNames={{ wrapper: "px-4 md:px-10" }}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand onClick={() => navigate("/")} className="cursor-pointer gap-2">
          <div className="rounded-2xl bg-white/10 p-2 ring-1 ring-white/10">
            <AcmeLogo />
          </div>
          <div>
            <p className="text-xl font-black tracking-tight text-white">FairShare</p>
            <p className="hidden text-xs text-slate-400 sm:block">Split smarter, settle faster</p>
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-7 sm:flex" justify="center">
        {navItems.map((item) => (
          <NavbarItem key={item.label}>
            <button onClick={item.action} className="text-sm font-semibold text-slate-300 transition hover:text-white">
              {item.label}
            </button>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link onClick={() => navigate("/login")} className="cursor-pointer font-semibold text-slate-300 hover:text-white">
            Login
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button
            onClick={() => navigate("/signup")}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 font-bold text-white shadow-lg shadow-blue-950/40"
          >
            Get Started
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-slate-950/95 pt-8 text-white backdrop-blur-xl">
        {[...navItems, { label: "Login", action: () => navigate("/login") }, { label: "Sign up", action: () => navigate("/signup") }].map((item) => (
          <NavbarMenuItem key={item.label}>
            <Link color="foreground" className="w-full cursor-pointer text-white" onClick={item.action} size="lg">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export default NextuiNavbar;
