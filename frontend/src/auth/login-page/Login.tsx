import { useContext, useEffect, useState } from "react";
import Footer from "../../landingpage/Homepage/component/Footer";
import { useNavigate } from "react-router-dom";
import loginImg from "../../assets/creativeLogo.svg";
import Navbar from "../../landingpage/Homepage/component/Navbar";
import { useForm } from "react-hook-form";
import { Context } from "../../context/Context";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { errorNotifier, successNotifier } from "../../utilities/Toast";

interface FormData {
  accountType: "teacher" | "student";
  email: string;
  password: string;
  validId?: string;
}

function Login() {
  const navigate = useNavigate();
  localStorage.removeItem("creativeToken");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);
  const { access, login, loadUserDetails } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  const accountType = watch("accountType");

  useEffect(() => {
    if (access) {
      switch (access.accountType) {
        case "teacher":
          navigate("/teacher/home");
          break;
        case "student":
          navigate("/user/home");
          break;
      }
    }
    loadUserDetails();
  }, [access]);

  const submitDetails = async (data: FormData) => {
    data.email = data.email.toLowerCase();
    setIsLoading(true);
    try {
      let endpoint = "user/login";
      if (data.accountType === "student") {
        endpoint = "student/login";
      }
      await login(data, endpoint);
      setIsLoading(false);
      if (access) {
        loadUserDetails();
        setIsLoading(false);
        switch (access?.accountType) {
          case "teacher":
            successNotifier("Login successful!");
            navigate("/teacher/home");
            break;
          case "student":
            successNotifier("Login successful!");
            navigate("/user/home");
            break;
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      let message = error.response.data.message;
      errorNotifier(message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full flex justify-center items-center pt-4 md:pt-2">
        <div className="hidden lg:w-1/2 lg:block p-4">
          <div className="flex justify-center items-center rounded-full">
            <img
              src={loginImg}
              alt="signup page"
              className="w-[500px] h-[500px] rounded-full"
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2 sm:p-8 lg:p-14">
          <div className="">
            <div className="text-black text-3xl text-center font-semibold w-full mb-2">
              Welcome <span className="text-primary">Back!</span>
            </div>
            <div className="text-sm text-center font-thin w-full mb-4">
              Kindly put in your login details and process.
            </div>
          </div>

          <div className="w-full">
            <form
              onSubmit={handleSubmit(submitDetails)}
              className="w-full flex flex-col px-6 items-center justify-center gap-y-[10px]"
            >
              <div className="flex justify-center space-x-8 my-6">
                <div className="flex items-center space-x-3">
                  <input
                    className="w-4 h-4"
                    type="radio"
                    id="teachers"
                    value="teacher"
                    {...register("accountType", { required: true })}
                  />
                  <div className="flex flex-col">
                    <span className="text-black text-xs lg:text-sm ">
                      Login as
                    </span>
                    <label
                      htmlFor="teachers"
                      className="text-black font-semibold lg:text-xl"
                    >
                      Teacher
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    className="w-4 h-4"
                    type="radio"
                    id="students"
                    value="student"
                    {...register("accountType", { required: true })}
                  />
                  <div className="flex flex-col">
                    <span className="text-black text-xs lg:text-sm ">
                      Login as
                    </span>
                    <label
                      htmlFor="students"
                      className="text-black font-semibold lg:text-xl"
                    >
                      Parent
                    </label>
                  </div>
                </div>
              </div>
              {errors.accountType?.type === "required" && (
                <p className="text-red-500 text-xs italic">
                  Please select a user type.
                </p>
              )}

              <div className="w-full mb-6 lg:mb-10">
                <label className="block font-medium text-para text-sm mb-1">
                  Email:
                </label>
                <div className="w-full rounded-md shadow-sm bg-transparent border-primary border">
                  <input
                    className="w-full p-3 rounded-full sm:px-5 bg-transparent border border-gray-300 outline-none focus:shadow-none focus:border-none"
                    placeholder="Email"
                    type="email"
                    {...register("email", {
                      required: true,
                    })}
                  />
                </div>
                {errors.email?.type === "required" && (
                  <p className="text-red-500 text-xs italic">
                    Your email is required
                  </p>
                )}
              </div>

              {accountType === "student" && (
                <div className="w-full mb-6 lg:mb-10">
                  <label className="block font-medium text-para text-sm mb-1">
                    Student ID:
                  </label>
                  <div className="w-full rounded-md shadow-sm bg-transparent border-primary border">
                    <input
                      className="w-full p-3 rounded-full sm:px-5 bg-transparent border border-gray-300 outline-none focus:shadow-none focus:border-none"
                      placeholder="Eg. CKA/Mhdz"
                      type="text"
                      {...register("validId", {
                        required: true,
                      })}
                    />
                  </div>
                  {accountType === "student" &&
                    errors.validId?.type === "required" && (
                      <p className="text-red-500 text-xs italic">
                        Your Student ID is required
                      </p>
                    )}
                </div>
              )}

              <div className="w-full mb-2">
                <label className="block font-medium text-para text-sm mb-1">
                  Password:
                </label>
                <div className="w-full rounded-md border-primary border shadow-sm bg-transparent flex justify-between items-center pr-1">
                  <input
                    className="w-full rounded-full sm:px-5 p-3 bg-transparent border border-gray-300 outline-none focus:shadow-none focus:border-none"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
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
                {errors.password?.type === "required" && (
                  <p className="text-red-500 text-xs italic">
                    Please enter a password
                  </p>
                )}
              </div>
              <div className="w-full mb-4 lg:mb-8 flex text-xs items-center justify-between text-para">
                <label
                  htmlFor="rem"
                  className="hover:text-primary cursor-pointer"
                >
                  <input
                    id="rem"
                    type="checkbox"
                    name="rememberMe"
                    className="text-primary border-primary focus:border-primary focus:shadow-none mr-1"
                  />
                  Remember Me
                </label>
                {/* <Link to="/forgot-password" className="text-primary">
                  Forget Password?
                </Link> */}
              </div>
              <button
                type="submit"
                className="bg-primary w-full border hover:bg-white hover:text-primary hover:border-primary rounded-md px-8 py-3 flex justify-center text-white font-semibold lg:w-[200px] mb-6 mx-auto my-3"
              >
                {isLoading ? "Processing..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
