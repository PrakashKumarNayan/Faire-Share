import React, { useEffect, useState } from "react";
import { Avatar, Button } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import userAPI from "../APIcalls/UserAPIs";
import { login } from "../store/Slices/authSlice";

function ProfilePage() {
  const currentUser = useSelector((state) => state.auth.userData);
  const [profileUser, setProfileUser] = useState(currentUser);
  const [email, setEmail] = useState(currentUser?.email || "");
  const [mobileNo, setMobileNo] = useState(currentUser?.mobileNo || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await userAPI.getCurrentUser();
        if (response?.data) {
          setProfileUser(response.data);
          setEmail(response.data.email || "");
          setMobileNo(response.data.mobileNo || "");
          setAvatarPreview(response.data.avatar || "");
          dispatch(login(response.data));
        }
      } catch (error) {
        console.log("Current user fetch error:", error);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);
      const response = await userAPI.updateProfile({
        email,
        mobileNo,
        avatar: avatarFile,
      });

      if (response?.data) {
        setProfileUser(response.data);
        setAvatarPreview(response.data.avatar || "");
        setAvatarFile(null);
        dispatch(login(response.data));
        setMessage("Profile updated successfully");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Unable to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-myFont text-3xl font-semibold">My Settings</h1>
            <p className="mt-1 text-sm text-slate-400">
              Update your profile photo, email address and phone number.
            </p>
          </div>
          <Button
            variant="bordered"
            className="h-10 rounded-xl border-slate-700 bg-[#0f172a] px-4 text-slate-200"
            onClick={() => navigate("/chats")}
          >
            <IoArrowBack size={18} />
            Back
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <Avatar
                src={avatarPreview}
                name={profileUser?.fullName || "User"}
                className="h-28 w-28 border border-slate-700 text-large"
              />
              <h2 className="mt-4 font-myFont text-xl font-semibold text-white">
                {profileUser?.fullName || "FairShare User"}
              </h2>
              <p className="mt-1 break-all text-sm text-slate-400">
                {profileUser?.email || "No email available"}
              </p>
              <label className="mt-5 flex h-10 cursor-pointer items-center justify-center rounded-xl border border-slate-700 bg-[#111827] px-4 text-sm font-semibold text-slate-200 transition hover:border-blue-500/60 hover:bg-[#1e293b]">
                Change photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </aside>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5 shadow-sm md:p-6"
          >
            <div className="border-b border-slate-800 pb-5">
              <h2 className="font-myFont text-xl font-semibold text-white">
                Profile details
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                These details are used across chats and group member lists.
              </p>
            </div>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-700 bg-[#020617] px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-700 bg-[#020617] px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                  placeholder="Enter mobile number"
                  required
                />
              </div>
            </div>

            {(message || error) && (
              <div
                className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
                  error
                    ? "border-red-500/30 bg-red-500/10 text-red-300"
                    : "border-blue-500/30 bg-blue-500/10 text-blue-300"
                }`}
              >
                {error || message}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="bordered"
                className="h-11 rounded-xl border-slate-700 bg-[#111827] px-5 text-slate-200"
                onClick={() => navigate("/chats")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={loading}
                className="h-11 rounded-xl bg-blue-600 px-6 font-semibold text-white hover:bg-blue-500"
              >
                Save changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
