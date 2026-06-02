import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import userAPI from "../APIcalls/UserAPIs";
import { CircularProgress } from "@nextui-org/react";
import { login } from "../store/Slices/authSlice";
import { useDispatch } from "react-redux";

function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registerUser = async (userData) => {
    try {
      setError(false);
      setLoading(true);
      const responseData = await userAPI.signUp(userData);
      if (responseData) {
        const currentUser = await userAPI.getCurrentUser();
        dispatch(login(currentUser.data));
        navigate("/chats");
      }
    } catch (error) {
      setError(true);
      setErrorMessage(error?.response?.data?.message || "Signup failed. Please try again.");
      console.error("ERR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.34),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.28),transparent_32%)]" />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden lg:block">
          <button onClick={() => navigate("/")} className="mb-10 text-3xl font-black">FairShare</button>
          <h1 className="text-6xl font-black leading-tight">Create your modern expense workspace.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">Signup once and start tracking group expenses, balances, chat messages and settlements from one professional dashboard.</p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {["Clean UI", "Group Chats", "Auto Split", "Secure Profile"].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/10 p-5 font-bold backdrop-blur-xl">{item}</div>
            ))}
          </div>
        </div>

        <div className="pro-card rounded-[2rem] p-6 md:p-9">
          <button onClick={() => navigate("/")} className="mb-7 text-2xl font-black lg:hidden">FairShare</button>
          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-300">Signup</p>
            <h1 className="mt-3 text-4xl font-black">Start with FairShare</h1>
            <p className="mt-2 text-slate-400">Fill your details to create a new account.</p>
          </div>

          <form onSubmit={handleSubmit(registerUser)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input type="text" className="input-pro" id="name" placeholder="Full Name" {...register("fullName", { required: true })} />
              <input type="text" className="input-pro" id="mobileNo" placeholder="Mobile Number" {...register("mobileNo", { required: true })} />
            </div>
            <input type="text" className="input-pro" id="email" placeholder="Email" {...register("email", { required: true })} />
            <div className="grid gap-4 md:grid-cols-2">
              <input type="password" className="input-pro" id="password" placeholder="Password" {...register("password", { required: true })} />
              <input type="password" className="input-pro" id="reEnteredPassword" placeholder="Re-enter Password" {...register("reEnteredPassword", { required: true })} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <span className="mb-3 block text-sm font-bold text-slate-300">Profile Picture</span>
                <input type="file" id="avatar" accept="image/*" required className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-blue-700" {...register("avatar", { required: true })} />
              </label>
              <label className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <span className="mb-3 block text-sm font-bold text-slate-300">Cover Picture</span>
                <input type="file" id="coverImage" accept="image/*" className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-violet-700" {...register("coverImage", { required: true })} />
              </label>
            </div>

            {error && <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-3 text-center text-sm font-semibold text-red-300">{errorMessage}</div>}

            <button className="btn-pro flex w-full items-center justify-center px-6 py-4" type="submit">
              {loading ? <CircularProgress color="default" size="sm" aria-label="Loading..." /> : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">Already have an account? <button onClick={() => navigate("/login")} className="font-bold text-blue-300">Login</button></p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
