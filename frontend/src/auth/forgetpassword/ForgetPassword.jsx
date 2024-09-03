import { useContext, useState, useEffect } from "react";
import ApiAuth from "../../api/ApiAuth";
import { Context } from "../../context/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import loading from "../../assets/Cityfix-Logo-Green-Gif2.gif";
import { FaArrowLeft } from "react-icons/fa";
import "../signup-page/signup.css";
import Navbar from "../../landingpage/components/Navbar";
import Footer from "../../landingpage/components/Footer";

function ForgetPassword() {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const navigate = useNavigate();
  const { access } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  const submitDetails = (data) => {
    setIsLoading(true);
    ApiAuth.post("/auth/forgot-password", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access?.token,
      },
    })
      .then((response) => {
        setIsLoading(false);
        console.log(response.data);
        const cityFixTokenAccess = { id: response?.data.id };
        localStorage.setItem("cityToken", JSON.stringify(cityFixTokenAccess));
        successMsg(response?.data?.msg);
        setTimeout(() => navigate("/user/verify-token"), 2000);
      })
      .catch((err) => {
        setIsLoading(false);
        let message;
        message = err?.msg;
        if (err?.response !== undefined) {
          message = err?.response?.msg;
          if (err?.response?.status == 500) {
            message = "Your backend does not work";
          } else {
            message = err?.response?.data?.msg;
          }
        }
        console.log(message);
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
          <div className="w-full h-full p-4 lg:py-3 lg:pl-6 lg:pr-15">
            <div className="w-full text-left flex mb-6 p-2 items-start justify-start">
              <Link
                to="/user/login"
                className="flex items-center gap-x-1 text-left justify-start text-primary hover:text-hover"
              >
                <FaArrowLeft className="w-6 h-6" /> Go back
              </Link>
            </div>
            <div className="w-full mb-6 p-2">
              <div className="text-primary text-2xl font-semibold w-full mb-4">
                {" "}
                Forgotten Password
              </div>
              <div className="text-h2 text-xs font-thin w-full">
                Kindly enter the email address associated with your account
              </div>
            </div>
            <form
              onSubmit={handleSubmit(submitDetails)}
              className="flex flex-col items-center justify-center w-full p-2"
            >
              <div className="w-full mb-4 lg:mb-6">
                <label className="block font-medium text-para text-sm mb-2">
                  Email:
                </label>
                <input
                  className="w-full h-full py-2 px-2 border-para rounded-md focus:border-none  text-para text-sm bg-transparent outline-none focus:outline-none focus:shadow-none focus:border-formBorder focus:bg-formbg"
                  type="text"
                  {...register("email", {
                    required: true,
                  })}
                />
                {errors.email?.type === "required" && (
                  <p className="text-red-500 text-xs italic">
                    Email is required
                  </p>
                )}
              </div>
              <p className="font-thin text-left text-xs pl-1 w-full">
                We will be sending a verification code to reset your password
              </p>
              <br />
              <div className="w-full flex items-center justify-center gap-x-3 mt-4 lg:mt-8">
                <p className="text-left w-full p-2 text-xs">
                  Can't reset password?
                  <Link
                    to="/user/signup"
                    id="-signup-link"
                    className=" text-primary text-xs hover:text-hover px-3 py-1 font-semibold rounded-md"
                  >
                    create new account
                  </Link>
                </p>
              </div>
              <button
                id="login-btn"
                className="w-full mb-1 text-sm rounded-2xl text-white  bg-primary hover:bg-hover px-1 py-1 lg:py-2 mt-10 lg:mt-14"
                type="submit"
              >
                Proceed
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Footer/>
    </div>
  );
}

export default ForgetPassword;
