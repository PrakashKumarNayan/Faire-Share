import React from "react";
import { useNavigate } from "react-router-dom";
import NextuiNavbar from "../components/NextuiNavbar";
import { ReactTyped } from "react-typed";
import { motion } from "framer-motion";
import { FaChartPie, FaComments, FaShieldAlt, FaUsers } from "react-icons/fa";

function HomePage() {
  const navigate = useNavigate();

  const stats = [
    { label: "Active groups", value: "100+" },
    { label: "Faster settlements", value: "3x" },
    { label: "Expense clarity", value: "99%" },
  ];

  const features = [
    { icon: <FaUsers />, title: "Group Expense Tracking", desc: "Create groups for trips, roommates, dining and events with transparent member-wise records." },
    { icon: <FaChartPie />, title: "Smart Distribution", desc: "Automatically calculate who paid, who owes and the simplest settlement path." },
    { icon: <FaComments />, title: "Chat + Expense Flow", desc: "Discuss plans and send expense messages inside the same clean workspace." },
    { icon: <FaShieldAlt />, title: "Secure Accounts", desc: "JWT based login with protected user sessions and private group information." },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <NextuiNavbar />

      <section className="relative min-h-screen px-6 pt-28 md:px-12 lg:px-20">
        <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.35),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.28),transparent_30%),linear-gradient(135deg,#020617,#0f172a_45%,#111827)]" />
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 backdrop-blur-xl">
              Modern expense sharing platform
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Sharing made <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">simple</span>
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-2xl font-bold text-slate-200 md:text-3xl">
              <span>Flexible distribution for</span>
              <ReactTyped
                className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent"
                strings={["Trips", "Roommates", "Grocery", "Dining Out"]}
                typeSpeed={110}
                backSpeed={100}
                loop
              />
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Track group expenses, split bills fairly and understand who owes what with a clean dashboard, live chat and automatic calculations.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <button onClick={() => navigate("/signup")} className="btn-pro px-8 py-4 text-base">
                Start FairShare
              </button>
              <button onClick={() => navigate("/login")} className="rounded-2xl border border-white/15 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-xl transition hover:bg-white/15">
                Login
              </button>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                  <h3 className="text-2xl font-black text-white">{item.value}</h3>
                  <p className="mt-1 text-xs font-medium text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-r from-blue-600/30 to-violet-600/30 blur-2xl" />
            <div className="pro-card relative rounded-[2rem] p-5 md:p-7">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Trip Dashboard</p>
                  <h2 className="text-2xl font-black">Goa Group</h2>
                </div>
                <div className="rounded-2xl bg-emerald-500/15 px-4 py-2 text-sm font-bold text-emerald-300">Settling</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-blue-600/20 p-5 ring-1 ring-blue-400/20">
                  <p className="text-sm text-blue-100">Total spent</p>
                  <h3 className="mt-2 text-3xl font-black">₹24,850</h3>
                </div>
                <div className="rounded-3xl bg-violet-600/20 p-5 ring-1 ring-violet-400/20">
                  <p className="text-sm text-violet-100">Per person</p>
                  <h3 className="mt-2 text-3xl font-black">₹4,970</h3>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {["Aman paid ₹8,500", "Riya paid ₹6,200", "You paid ₹10,150"].map((text, index) => (
                  <div key={text} className="flex items-center justify-between rounded-2xl bg-slate-900/80 p-4 ring-1 ring-white/10">
                    <span className="font-semibold text-slate-200">{text}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">#{index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-3xl bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 p-5 ring-1 ring-emerald-400/20">
                <p className="text-sm font-semibold text-emerald-200">Suggested settlement</p>
                <h3 className="mt-1 text-xl font-black">Aman pays You ₹1,230</h3>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-300">Features</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">Built for clean expense management</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="pro-card rounded-3xl p-6 transition hover:-translate-y-1 hover:border-blue-400/40">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 text-2xl text-blue-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
