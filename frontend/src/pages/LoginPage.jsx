import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import userAPI from "../APIcalls/UserAPIs";
import { CircularProgress } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { login } from "../store/Slices/authSlice";
import { FaChartLine, FaLock, FaUsers } from "react-icons/fa";

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState("");
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginUser = async (userData) => {
    try {
      setSuccess(false);
      setError(false);
      setLoading(true);
      const loginData = await userAPI.login(userData);

      if (loginData) {
        const currentUser = await userAPI.getCurrentUser();
        if (currentUser) {
          dispatch(login(currentUser.data));
          setUser(currentUser.data.fullName);
          setSuccess(true);
        }
      }
    } catch (error) {
      console.error("ERR:", error);
      setError(true);
      setErrorMessage(error?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-slate-950 text-white lg:grid-cols-2">
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4 backdrop-blur-xl">
          <div className="pro-card max-w-xl rounded-[2rem] p-10 text-center">
            <h1 className="text-4xl font-black">Welcome back, {user}!</h1>
            <p className="mt-3 text-slate-400">Your workspace is ready.</p>
            <button className="btn-pro mt-8 px-8 py-3" onClick={() => navigate("/chats")}>Open Dashboard</button>
          </div>
        </div>
      )}

      <div className="relative hidden overflow-hidden p-12 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.38),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(124,58,237,0.32),transparent_35%),linear-gradient(135deg,#020617,#0f172a)]" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <button onClick={() => navigate("/")} className="w-fit text-2xl font-black tracking-tight">FairShare</button>
          <div>
            <p className="mb-4 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 w-fit">Professional expense workspace</p>
            <h1 className="max-w-xl text-6xl font-black leading-tight">Manage trips, groups and balances with clarity.</h1>
            <div className="mt-10 grid max-w-xl gap-4">
              {[{ icon: <FaUsers />, text: "Group based expense history" }, { icon: <FaChartLine />, text: "Automatic settlement calculation" }, { icon: <FaLock />, text: "Secure login and protected data" }].map((item) => (
                <div key={item.text} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                  <div className="rounded-2xl bg-blue-500/20 p-3 text-blue-200">{item.icon}</div>
                  <p className="font-semibold text-slate-200">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-slate-500">Split smarter • Settle faster • Stay transparent</p>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <button onClick={() => navigate("/")} className="mb-8 text-2xl font-black lg:hidden">FairShare</button>
          <div className="pro-card rounded-[2rem] p-7 md:p-9">
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-300">Login</p>
              <h1 className="mt-3 text-4xl font-black">Welcome back</h1>
              <p className="mt-2 text-slate-400">Enter your mobile number and password to continue.</p>
            </div>

            <form onSubmit={handleSubmit(loginUser)} className="space-y-5">
              <input type="text" className="input-pro" id="mobileNo" placeholder="Phone number" {...register("mobileNo", { required: true })} />
              <input type="password" className="input-pro" id="password" placeholder="Password" {...register("password", { required: true })} />

              {error && <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-3 text-center text-sm font-semibold text-red-300">{errorMessage}</div>}

              <button type="submit" className="btn-pro flex w-full items-center justify-center px-6 py-4">
                {!loading ? "Login" : <CircularProgress color="default" size="sm" aria-label="Loading..." />}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm">
              <button className="font-semibold text-blue-300 hover:text-blue-200" onClick={() => navigate("/forgotPassword")}>Forgot password?</button>
              <button className="font-semibold text-white hover:text-blue-200" onClick={() => navigate("/signup")}>Create account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
