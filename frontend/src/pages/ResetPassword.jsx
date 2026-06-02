import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CircularProgress } from "@nextui-org/react";

function ResetPassword() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="w-full ">
      <img
        src="https://images.pexels.com/photos/531756/pexels-photo-531756.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="Background"
        className="object-cover fixed top-0 z-0 h-full w-full"
      />
      <div className="text-colorLevel3 bg-colorLevel2 bg-opacity-80 md:w-[30%] rounded-xl md:max-w-[45%] h-auto md:h-[70vh] mt-32 md:mx-auto mx-8 mb-10 py-4 px-8 shadow-2xl z-10 relative">
        {/* {success && (
            <div className="fixed inset-0 bg-colorLevel1 bg-opacity-75 flex items-center justify-center z-10">
              <div className="bg-colorLevel1 p-8 rounded-xl shadow-2xl text-center">
                <h1 className="text-5xl font-bold text-colorLevel3">
                  Welcome again <span className="text-colorLevel3">{user}</span>{" "}
                  !
                </h1>

                <button
                  className="mt-8 px-8 py-3 bg-colorLevel5 text-white rounded-lg"
                  onClick={() => {
                    setSuccess(false);
                    navigate("/chats");
                  }}
                >
                  Start chatiing
                </button>
              </div>
            </div>
          )} */}

        <div className="w-full h-14 justify-center flex">
          <h1 className="text-3xl font-bold font-myFont pt-6">
            Reset Password
          </h1>
        </div>

        <form
          action=""
          // onSubmit={handleSubmit(loginUser)}
          className="font-myFont w-full mt-20 px-12"
        >
          <div className="w-full mt-8">
            <input
              type="text"
              className="w-full border-b-2 bg-inherit pl-1 text-white font-light focus:outline-none focus:ring-0"
              id="email"
              placeholder="Enter new password"
              // {...register("mobileNo", {
              //   required: true,
              // })}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="w-full mt-8">
            <input
              type="text"
              className="w-full border-b-2 bg-inherit pl-1 text-white font-light focus:outline-none focus:ring-0"
              id="email"
              placeholder="Confirm password"
              // {...register("mobileNo", {
              //   required: true,
              // })}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="w-full flex justify-center mt-20">
            <button
              type="submit"
              className="rounded-lg px-14 py-3 bg-colorLevel1 text-colorLevel3"
            >
              {!loading ? (
                "Reset"
              ) : (
                <CircularProgress color="primary" aria-label="Loading..." />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
