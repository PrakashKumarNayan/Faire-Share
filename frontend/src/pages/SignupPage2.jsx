import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import userAPI from "../APIcalls/UserAPIs";
import { CircularProgress } from "@nextui-org/react";
import { login } from "../store/Slices/authSlice";
import { useDispatch } from "react-redux";
import { RiImageAddFill } from "react-icons/ri";

function SignupPage2() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const coverImage = watch("coverImage");
  const profileImage = watch("avatar");

  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  useEffect(() => {
    register("coverImage");
  }, [register]);

  const avatarRegister = register("avatar");

  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };

  const handleProfileClick = () => {
    profileInputRef.current?.click();
  };

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
      setErrorMessage(error.response?.data?.message || error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#07111f] via-[#0b1b33] to-[#180f35] relative overflow-auto pb-10">

      {/* Cover Image */}
      <div
        className="w-full relative cursor-pointer overflow-hidden bg-gradient-to-r from-[#0f1d3a] via-[#172f63] to-[#36155f]"
        style={{ height: "300px" }}
        onClick={handleCoverClick}
      >
        {coverImage && coverImage.length > 0 && (
          <img
            src={URL.createObjectURL(coverImage[0])}
            alt="Cover"
            className="w-full h-full object-cover brightness-75"
          />
        )}

        {!coverImage && (
          <div className="h-full flex flex-col justify-center px-10 md:px-24">
            <p className="w-fit px-5 py-2 rounded-full bg-white/10 border border-white/10 text-cyan-300 text-sm font-semibold mb-5">
              Modern expense sharing platform
            </p>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Create your <br />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                FairShare
              </span>{" "}
              account
            </h1>

            <p className="text-gray-300 mt-5 text-lg max-w-xl">
              Split bills fairly, track expenses and manage groups easily.
            </p>
          </div>
        )}

        <input
          type="file"
          id="coverImage"
          accept="image/*"
          className="hidden"
          ref={coverInputRef}
          onChange={(e) => setValue("coverImage", e.target.files, { shouldValidate: true })}
        />
      </div>

      {/* Profile Image */}
      <div className="relative flex justify-center -mt-20 z-20">
        <div
          className="w-40 h-40 rounded-full bg-white/10 backdrop-blur-xl overflow-hidden flex items-center justify-center cursor-pointer border-4 border-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.45)]"
          onClick={handleProfileClick}
        >
          {profileImage && profileImage.length > 0 ? (
            <img
              src={URL.createObjectURL(profileImage[0])}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <RiImageAddFill size={42} className="text-cyan-300" />
          )}
        </div>

        <input
          type="file"
          id="avatar"
          accept="image/*"
          className="hidden"
          {...avatarRegister}
          ref={(e) => {
            profileInputRef.current = e;
            avatarRegister.ref(e);
          }}
          onChange={(e) => {
            avatarRegister.onChange?.(e);
            setValue("avatar", e.target.files, { shouldValidate: true });
          }}
        />
      </div>

      {/* Form Section */}
      <div className="w-[90%] md:w-[420px] mx-auto mt-8 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl px-8 py-8 shadow-2xl">
        <h2 className="text-white text-2xl font-bold text-center">
          Sign up
        </h2>
        <p className="text-gray-300 text-center mt-2 text-sm">
          Complete your profile to continue
        </p>

        <form
          onSubmit={handleSubmit(registerUser)}
          className="font-myFont w-full mt-8"
        >
          {[
            ["text", "Full Name", "fullName", "name"],
            ["text", "Mobile Number", "mobileNo", "mobileNo"],
            ["text", "Email", "email", "email"],
            ["password", "Password", "password", "password"],
            ["password", "Re-enter Password", "reEnteredPassword", "reEnteredPassword"],
          ].map(([type, placeholder, regName, id]) => (
            <div className="w-full mt-5" key={id}>
              <input
                type={type}
                id={id}
                placeholder={placeholder}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-300 outline-none focus:border-cyan-400"
                {...register(regName, { required: true })}
              />
            </div>
          ))}

          {errors.avatar && (
            <div className="text-center pt-3 text-red-400">
              {errors.avatar.message}
            </div>
          )}
          {error && (
            <h1 className="text-center pt-3 text-red-400">{errorMessage}</h1>
          )}

          <button
            className="w-full mt-7 rounded-xl py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold hover:scale-[1.02] transition-all duration-300"
            type="submit"
          >
            {loading ? (
              <CircularProgress color="primary" aria-label="Loading..." />
            ) : (
              "Signup"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
export default SignupPage2;
