import { React, useRef, useContext, useState, useEffect } from "react";
import ApiAuth from "../../api/ApiAuth";
import { Link, NavLink, useNavigate } from "react-router-dom";
// import Nav from "../../components/navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loading from "../../assets/Cityfix-Logo-Green-Gif2.gif";
import { FaArrowLeft } from "react-icons/fa";
import "../signup-page/signup.css";
import Navbar from "../../landingpage/components/Navbar";
import Footer from "../../landingpage/components/Footer";

const VerifyOTP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const successMsg = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const errorMsg = (error) => {
    toast.error(error, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value !== "" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    const enteredOtp = otp.join("").toString();
    const requestBody = {
      otp: enteredOtp,
    };

    ApiAuth.post("/auth/verify", JSON.stringify(requestBody), {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setTimeout(() => {
          setIsLoading(false);
          successMsg(response.data.msg);
          navigate("/user/login");
        }, 3000);
      })
      .catch((err) => {
        setIsLoading(false);
        let message = "Not responing at the moment";
        if (err?.response != undefined) {
          message = err?.response?.data?.msg;
        }
        console.log(err);
        errorMsg(message);
      });
  };

  return isLoading ? (
    <div className="w-full h-screen flex justify-center items-center">
      {" "}
      <img className="w-10 md:w-20" src={loading} alt="Wait for it...." />{" "}
    </div>
  ) : (
    <div className="w-full flex flex-col">
      <Navbar />
      <div className="w-full p-3 h-full md:h-screen shadow-sm shadow-primary flex flex-col md:flex-row items-center justify-center">
        <div className="hidden rounded-lg h-full sm:w-4/5 lg:w-1/2 mx-auto md:flex justify-center bg items-center py-2">
          <div></div>
        </div>
        <div className=" w-full sm:w-4/5 lg:w-1/2 flex justify-center items-center p-8">
          <div className="w-full h-full p-4 lg:py-3 lg:pl-6 lg:pr-10">
            <div className="w-full text-left flex mb-6 p-2 items-start justify-start">
              <Link
                to="/user/signup"
                className="flex items-center gap-x-1 text-left justify-start text-primary hover:text-hover"
              >
                <FaArrowLeft className="w-6 h-6" /> Go back
              </Link>
            </div>
            <div className="w-full mb-6 p-2">
              <div className="text-primary text-2xl font-semibold w-full mb-2">
                {" "}
                OTP Verification
              </div>
              <div className="text-h2 text-sm font-thin  w-full">
                Kindly provide the 4-digit pin that was sent to your email
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex gap-x-8 mb-8 lg:mb-10 mx-auto items-center justify-center px-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    value={digit}
                    className="w-10 p-1 text-xs text-center border-1/2 rounded-md border-primary focus:border-hover focus:shadow-none focus:outline-none"
                    onChange={(e) => handleOtpChange(e, index)}
                    maxLength={1}
                    pattern="\d"
                    title="Please enter a single digit"
                    ref={(el) => (inputRefs.current[index] = el)}
                    required
                  />
                ))}
              </div>
              <button
                id="login-btn"
                className="w-full mb-1 text-sm rounded-2xl text-white  bg-primary hover:bg-hover px-1 py-1 lg:py-2"
                type="submit"
              >
                Verify code
              </button>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
      <Footer/>
    </div>
  );
};

export default VerifyOTP;
