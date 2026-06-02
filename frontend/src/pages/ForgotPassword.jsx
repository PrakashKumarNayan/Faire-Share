import React, { useRef, useState } from "react";
import { CircularProgress } from "@nextui-org/react";
import UserAPIs from "../APIcalls/UserAPIs";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(null);
  const [error, setError] = useState(false);
  const [validated, setValidated] = useState(false);
  const [newPassword,setNewPassword]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  const [errorMessage,setErrorMessage]= useState('');
  const [isOtpSend,setIsOtpSent]=useState(false);
  const [success,setSuccess]=useState(false);
  
  const [loading,setLoading]=useState(false)
  const [otpLoading,setOtpLoading]= useState(false);
  const [resetLoading,setResetLoading]=useState(false);

  const navigate = useNavigate();


  const inputRefs = useRef([]);
  const handleInputChange = (index, event) => {
    const value = event.target.value;

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (event.key === "Backspace" && !value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const sendotp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email) {
      alert("Enter valid email");
      return;
    }
    try {
      setOtpLoading(true);
      const otpresponse = await UserAPIs.sendOtp({ email });
      if (otpresponse) {
        setIsOtpSent(true);
        setOtp(otpresponse.data.otp);
        setOtpLoading(false);
      }
    } catch (error) {
      setOtpLoading(false)
      setError(true);
      setErrorMessage(error.response.data.message)
      // console.log("ERR:", error);
    }
    setError(false);
  };

  const validateOtp = (e) => {
    e.preventDefault();
    setErrorMessage('')
    const enteredOtp = inputRefs.current.map((input) => input?.value).join("");


    if (enteredOtp.length < 6 || isNaN(enteredOtp)) {
      alert("Enter valid OTP");
    }

    if (enteredOtp !== otp) {
      setError(true);
    } else {
      setValidated(true)
    }
    setError(false)
  };

  const resetPassword = async ()=>{
    setErrorMessage('');
    if(newPassword !== confirmPassword){
      alert("Both passwords should be same")
    }
    try {
      setResetLoading(true);
      const resetResponse = await UserAPIs.resetPassword({email,newPassword});
      if(resetResponse){
        setSuccess(true);
        console.log("Reset response :",resetResponse)
        setResetLoading(false);
      }
    } catch (error) {
      setError(true)
      setErrorMessage(error.response.data.message);
      setResetLoading(false);
      console.log("ERR:",error)
    }
    setError(false);
  }

  return (
    <>
      <div className="w-full  bg-colorLevel1 h-screen pt-32 ">
        <div className="text-colorLevel3 bg-colorLevel2 bg-opacity-80 md:w-[30%] rounded-xl md:max-w-[45%] h-auto   md:mx-auto mx-8 mb-10 py-4 px-8 shadow-2xl z-10 relative pb-10">
          {success && (
            <div className="fixed inset-0 bg-colorLevel1 bg-opacity-75 flex items-center justify-center z-10">
              <div className="bg-colorLevel1 p-8 rounded-xl shadow-2xl text-center">
                <h1 className="text-5xl font-bold text-colorLevel3">
                  Your password changed successfully!
                </h1>

                <button
                  className="mt-8 px-8 py-3 bg-colorLevel5 text-white rounded-lg"
                  onClick={() => {
                    setSuccess(false);
                    navigate("/login");
                  }}
                >
                  Go to login page
                </button>
              </div>
            </div>
          )}

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
                type="email"
                className="w-full border-b-2 bg-inherit pl-1 text-white font-light focus:outline-none focus:ring-0"
                id="email"
                placeholder="Enter your registered email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {isOtpSend && (
              <h1 className="text-center pt-3 text-green-500 font-bold mt-3">OTP sent successfully</h1>
            )}

            {error && (
              <h1 className="text-center pt-3 text-red-500">{errorMessage}</h1>
            )}

            <div className="w-full flex justify-center mt-7">
              <button
                type="button"
                className="rounded-lg px-14 py-3 bg-colorLevel1 text-colorLevel3"
                onClick={sendotp}
              >
                {!otpLoading ? (
                  "Generate OTP"
                ) : (
                  <CircularProgress color="primary" aria-label="Loading..." />
                )}
              </button>
            </div>

            <div className="w-full flex justify-center">
              <div className="w-full flex justify-center mt-10">
                {/* Container for the 6-digit input boxes */}
                <div className="flex space-x-2 mb-6">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      ref={(el) => (inputRefs.current[index] = el)} // Store reference to each input
                      className="w-12 h-12 text-center border border-colorLevel1 rounded-lg focus:outline-none focus:border-colorLevel2"
                      onChange={(e) => handleInputChange(index, e)} // Handle input change
                      onKeyDown={(e) => handleInputChange(index, e)} // Handle backspace
                    />
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <h1 className="text-center pt-3 text-red-500">OTP not matched</h1>
            )}
            <div className="w-full flex justify-center mt-4 ">
              <button
                type="button"
                className="rounded-lg px-14 py-3 bg-colorLevel1 text-colorLevel3"
                onClick={validateOtp}
              >
                {!validated ? (
                  "Validate OTP"
                ) : (
                  "OTP Validated"
                )}
              </button>
            </div>
          </form>

          {validated && (
            <form
              action=""
              // onSubmit={handleSubmit(loginUser)}
              className="font-myFont w-full mt-20 px-12"
            >
              <div className="w-full mt-8">
                <input
                  type="password"
                  className="w-full border-b-2 bg-inherit pl-1 text-white font-light focus:outline-none focus:ring-0"
                  id="newPassword"
                  placeholder="Enter new password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="w-full mt-8">
                <input
                  type="password"
                  className="w-full border-b-2 bg-inherit pl-1 text-white font-light focus:outline-none focus:ring-0"
                  id="confirmPassword"
                  placeholder="Confirm password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="w-full flex justify-center mt-20">
                <button
                  type="button"
                  className="rounded-lg px-14 py-3 bg-colorLevel1 text-colorLevel3"
                  onClick={resetPassword}
                >
                  {!loading ? (
                    "Reset"
                  ) : (
                    <CircularProgress color="primary" aria-label="Loading..." />
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
