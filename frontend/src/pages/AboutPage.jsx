import React from "react";

function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-900 px-6 py-24 text-white">
      <div className="max-w-5xl mx-auto">

        {/* Main Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-10 shadow-2xl">

          <p className="text-blue-400 font-semibold mb-3">
            About Project
          </p>

          <h1 className="text-5xl font-bold mb-6">
            FairShare
          </h1>

          <p className="text-slate-300 text-lg leading-8">
            FairShare is a modern Expense Distribution System designed to simplify
            shared expense management for friends, roommates, travel groups, and teams.
            The platform helps users split expenses fairly, track payments, and maintain
            complete transparency without manual calculations.
          </p>

        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Purpose
            </h2>

            <p className="text-slate-300 leading-7">
              Reduce confusion and automate group expense calculations efficiently.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              Features
            </h2>

            <p className="text-slate-300 leading-7">
              Expense tracking, balance management, group chat, and secure login system.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">
              Technology
            </h2>

            <p className="text-slate-300 leading-7">
              Developed using React, Tailwind CSS, Node.js, Express.js, MongoDB, and JWT.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AboutPage;