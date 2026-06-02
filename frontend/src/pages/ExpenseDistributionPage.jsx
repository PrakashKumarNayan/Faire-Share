import React, { useEffect, useState } from "react";
import { Avatar, DateRangePicker, Button, Progress } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { useSelector } from "react-redux";
import conversationAPIs from "../APIcalls/conversations";
import PieChart from "../components/PieChart";
import { FaArrowTrendUp, FaIndianRupeeSign, FaPeopleGroup, FaReceipt } from "react-icons/fa6";

function ExpenseDistributionPage() {
  const chatDetails = useSelector((state) => state.chats.chatData);
  const chatHistory = useSelector((state) => state.chats.allChats);
  const [groupMembers, setGroupMembers] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [memberPayments, setMemberPayments] = useState([]);
  const [expenseTips, setExpenseTips] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const allMembers = await conversationAPIs.getAllMembers(chatDetails.members);
        if (allMembers) setGroupMembers(allMembers.data);
      } catch (error) {
        console.log("ERR:", error);
      }
    })();
  }, [chatDetails.members]);

  useEffect(() => {
    let total = 0;
    const payments = {};

    groupMembers.forEach((member) => {
      payments[member._id] = { name: member.fullName, paid: 0, _id: member._id };
    });

    const expenseMessages = chatHistory.filter((message) => message.messageType === "expenseMessage");
    expenseMessages.forEach((message) => {
      total += message.amount;
      if (payments[message.sender._id]) {
        payments[message.sender._id].paid += message.amount;
      } else {
        payments[message.sender._id] = { name: message.sender.name, paid: message.amount, _id: message.sender._id };
      }
    });

    setTotalAmount(total);
    setMemberPayments(Object.values(payments));
  }, [groupMembers, chatHistory]);

  const memberNames = memberPayments.map((member) => member.name);
  const memberExpense = memberPayments.map((member) => member.paid);
  const expenseMessageCount = chatHistory.filter((message) => message.messageType === "expenseMessage").length;
  const averageAmount = groupMembers.length ? totalAmount / groupMembers.length : 0;

  useEffect(() => {
    if (!groupMembers.length) {
      setExpenseTips([]);
      return;
    }

    const average = totalAmount / groupMembers.length;
    const balances = memberPayments.map((member) => ({ ...member, balance: member.paid - average }));
    const tips = [];
    const receivers = balances.filter((m) => m.balance > 0);
    const payers = balances.filter((m) => m.balance < 0);

    payers.forEach((payer) => {
      while (payer.balance < 0 && receivers.length > 0) {
        const receiver = receivers[0];
        const amountToSettle = Math.min(receiver.balance, Math.abs(payer.balance));
        tips.push(`${payer.name} will pay ${receiver.name} ₹${amountToSettle.toFixed(2)}`);
        payer.balance += amountToSettle;
        receiver.balance -= amountToSettle;
        if (receiver.balance <= 0) receivers.shift();
      }
    });

    setExpenseTips(tips);
  }, [memberPayments, totalAmount, groupMembers]);

  const stats = [
    { label: "Total Spent", value: `₹${totalAmount.toFixed(0)}`, icon: <FaIndianRupeeSign /> },
    { label: "Members", value: groupMembers.length, icon: <FaPeopleGroup /> },
    { label: "Expense Records", value: expenseMessageCount, icon: <FaReceipt /> },
    { label: "Average Share", value: `₹${averageAmount.toFixed(0)}`, icon: <FaArrowTrendUp /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[360px_1fr]">
        <aside className="border-r border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl">
          <div className="pro-card rounded-[2rem] p-6 text-center">
            <Avatar src={chatDetails.chatIcon} className="mx-auto h-32 w-32 text-large ring-4 ring-blue-500/30" />
            <h1 className="mt-4 text-2xl font-black">{chatDetails.chatName}</h1>
            <p className="mt-2 text-sm text-slate-400">Expense distribution dashboard</p>
          </div>

          <div className="mt-5 rounded-[2rem] border border-white/10 bg-slate-900/70 p-5">
            <h2 className="mb-4 text-lg font-black">Members</h2>
            <ul className="space-y-3">
              {groupMembers?.map((member) => (
                <li className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 transition hover:bg-white/10" key={member._id}>
                  <img src={member.avatar} alt="Profile pic" className="h-11 w-11 rounded-full object-cover ring-2 ring-white/10" />
                  <div className="min-w-0">
                    <h3 className="truncate font-bold">{member.fullName}</h3>
                    <p className="truncate text-xs text-slate-400">{member.mobileNo}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-[2rem] border border-white/10 bg-slate-900/70 p-5">
            <DateRangePicker
              label="Stay duration"
              isRequired
              defaultValue={{ start: parseDate("2024-04-01"), end: parseDate("2024-04-08") }}
              className="max-w-xs text-white"
            />
            <Button className="mt-4 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 font-bold text-white">Generate Report</Button>
          </div>
        </aside>

        <main className="overflow-y-auto p-5 md:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-300">Analytics</p>
              <h1 className="mt-2 text-4xl font-black">Distribution of Expense</h1>
              <p className="mt-2 text-slate-400">Professional summary of total spending and settlement suggestions.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="pro-card rounded-[2rem] p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 text-xl text-blue-300">{item.icon}</div>
                <h3 className="text-3xl font-black">{item.value}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="pro-card rounded-[2rem] p-5 md:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">Member Payments</h2>
                  <p className="text-sm text-slate-400">Contribution progress by each member</p>
                </div>
              </div>
              <ul className="space-y-4">
                {groupMembers.map((member) => {
                  const payment = memberPayments.find((payment) => member._id === payment._id);
                  if (!payment) return null;
                  return (
                    <li className="rounded-3xl border border-white/10 bg-slate-900/75 p-4" key={member._id}>
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar isBordered radius="lg" src={member.avatar} />
                          <div>
                            <h3 className="font-black">{member.fullName}</h3>
                            <p className="text-xs text-slate-400">Paid ₹{payment.paid.toFixed(0)}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-bold text-emerald-300">₹{payment.paid.toFixed(0)}</span>
                      </div>
                      <Progress
                        label="Total paid"
                        size="sm"
                        value={payment.paid}
                        maxValue={totalAmount || 1}
                        color="primary"
                        formatOptions={{ style: "currency", currency: "INR" }}
                        showValueLabel={true}
                        className="max-w-full"
                      />
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="pro-card rounded-[2rem] p-5 md:p-6">
              <h2 className="text-2xl font-black">Expense Chart</h2>
              <p className="mb-4 text-sm text-slate-400">Visual share of group payments</p>
              <div className="rounded-3xl bg-slate-900/70 p-4">
                <PieChart names={memberNames} amounts={memberExpense} />
              </div>
            </section>
          </div>

          <section className="pro-card mt-6 rounded-[2rem] p-5 md:p-6">
            <div className="mb-5">
              <h2 className="text-2xl font-black">Expense Sharing Tips</h2>
              <p className="text-sm text-slate-400">Use these suggestions to settle balances faster.</p>
            </div>
            {expenseTips.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {expenseTips.map((tip, index) => (
                  <div className="rounded-3xl border border-emerald-400/15 bg-emerald-500/10 p-4 font-semibold text-emerald-100" key={index}>
                    {tip}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-slate-400">No settlement tips available yet.</div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default ExpenseDistributionPage;
