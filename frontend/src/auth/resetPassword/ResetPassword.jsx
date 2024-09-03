import { useContext, useState, useEffect } from "react";
import ApiAuth from "../../api/ApiAuth";
import { Context } from "../../context/Context";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import loading from "../../assets/Cityfix-Logo-Green-Gif2.gif";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import "../signup-page/signup.css";
import Navbar from "../../landingpage/components/Navbar";
import Footer from "../../landingpage/components/Footer";

function ResetPassword() {
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
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const submitDetails = (data) => {
    setIsLoading(true);
    const id = JSON.parse(localStorage.getItem("cityToken"));
    console.log(id);
    console.log(id.id);
    ApiAuth.post("/auth/reset-password/" + id.id, data, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: "Bearer " + access?.token,
      },
    })
      .then((response) => {
        setIsLoading(false);
        successMsg("New password uodated successfully!");
        setTimeout(() => navigate("/user/login"), 1000);
      })
      .catch((err) => {
        setIsLoading(false);
        let message;
        message = err?.msg;
        if (err?.response !== undefined) {
          message = err?.response?.msg;
          if (err?.response?.status == 500) {
            message =
              "Server currently experincing issues. If error persists, report to the admin";
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
        <div className="hidden rounded-lg h-screen sm:w-4/5 lg:w-1/2 mx-auto md:flex justify-center bg items-center py-2"></div>
        <div className=" w-full sm:w-4/5 lg:w-1/2 flex justify-center items-center p-8">
          <div className="w-full h-full p-4 lg:py-3 lg:pl-6 lg:pr-10">
            <div className="w-full mb-6 p-2">
              <div className="text-primary text-2xl font-semibold w-full mb-2">
                {" "}
                Reset Password
              </div>
              <div className="text-h2 text-sm font-thin w-full">
                Kindly reset and confirm your password
              </div>
            </div>
            <form
              onSubmit={handleSubmit(submitDetails)}
              className="w-full mt-2"
            >
              <div className="mb-6 lg:mb-10">
                <label className="block font-medium text-para text-sm mb-1">
                  Password:
                </label>
                <div className="w-full rounded-sm  shadow-sm bg-transparent flex justify-between items-center pr-1">
                  <input
                    className="w-full h-full py-2 px-2 border-none focus:border-none rounded-sm  text-para text-sm bg-transparent outline-none focus:outline-none focus:shadow-none focus:border-formBorder focus:bg-formbg"
                    type={showPassword ? "text" : "password"}
                    {...register("newPassword", {
                      required: true,
                    })}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    className="text-primary"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.newPassword?.type === "required" && (
                  <p className="text-red-500 text-xs italic">
                    Please enter your new password
                  </p>
                )}
              </div>

              <div className="mb-6 lg:mb-10">
                <label className="block font-medium text-para text-sm mb-1">
                  Confirm Password:
                </label>
                <div className="w-full rounded-sm  shadow-sm bg-transparent flex justify-between items-center pr-1">
                  <input
                    className="w-full h-full py-2 px-2 border-none focus:border-none rounded-sm  text-para text-sm bg-transparent outline-none focus:outline-none focus:shadow-none focus:border-formBorder focus:bg-formbg"
                    type={showPasswords ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: true,
                    })}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPasswords(!showPasswords);
                    }}
                    className="text-primary"
                  >
                    {showPasswords ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword?.type === "required" && (
                  <p className="text-red-500 text-xs italic">
                    Please re-enter your password
                  </p>
                )}
              </div>
              <br />

              <button
                id="login-btn"
                className="w-full mb-1 text-sm rounded-2xl text-white  bg-primary hover:bg-hover px-1 py-1 lg:py-2"
                type="submit"
              >
                Login
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

export default ResetPassword;
