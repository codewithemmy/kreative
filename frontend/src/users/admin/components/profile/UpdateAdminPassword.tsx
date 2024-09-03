import React, { useState, useContext, ChangeEvent, FormEvent } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";

interface FormData {
  prevPassword: string;
  password: string;
}

function UpdateAdminPassword(): JSX.Element {
  const { adminAccess } = useContext(Context);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    prevPassword: "",
    password: "",
  });
  const [showPrevPassword, setShowPrevPassword] =
    useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (
    field: "prevPassword" | "password"
  ) => {
    if (field === "prevPassword") {
      setShowPrevPassword((prev) => !prev);
    } else if (field === "password") {
      setShowPassword((prev) => !prev);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await ApiAuth.patch(`admin/change-password/${adminAccess?.userId}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + adminAccess?.userToken,
        },
      });

      successNotifier("Password updated successfully");
    } catch (error) {
      errorNotifier("Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white mt-10">
      <h4 className="text-[18px]">Update Password</h4>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col w-full">
            <label
              htmlFor="prevPassword"
              className="text-[14px] font-body text-[#686868] py-2"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPrevPassword ? "text" : "password"}
                id="prevPassword"
                name="prevPassword"
                required
                value={formData.prevPassword}
                onChange={handleChange}
                className="w-[100%] md:w-[90%] lg:w-[90%] border border-[#7070702E] bg-transparent rounded-md"
              />
              <span
                className="absolute top-1/2 right-4 cursor-pointer transform -translate-y-1/2"
                onClick={() => togglePasswordVisibility("prevPassword")}
              >
                {showPrevPassword ? (
                  <IoEyeOutline size={20} />
                ) : (
                  <IoEyeOffOutline size={20} />
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-col w-full">
            <label
              htmlFor="password"
              className="text-[16px] text-[#686868] py-2"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                required
                onChange={handleChange}
                className="w-[100%] md:w-[90%] lg:w-[90%] border border-[#7070702E] bg-transparent rounded-md"
              />
              <span
                className="absolute top-1/2 right-4 cursor-pointer transform -translate-y-1/2"
                onClick={() => togglePasswordVisibility("password")}
              >
                {showPassword ? (
                  <IoEyeOutline size={20} />
                ) : (
                  <IoEyeOffOutline size={20} />
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-start">
          <button
            className="bg-primary rounded-3xl cursor-pointer hover:bg-hover mt-8 md:mt-12 px-4 py-2 md:w-[200px] col-span-3 text-white"
            type="submit"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateAdminPassword;
