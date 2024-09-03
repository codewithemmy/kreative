import React, { useState, useContext, ChangeEvent, FormEvent } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import CustomButton from "../../../../customBtn";

interface FormData {
  currentPassword: string;
  newPassword: string;
}

function UpdatePassword(): JSX.Element {
  const { access, setAccess } = useContext(Context);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    currentPassword: "",
    newPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (
    field: "currentPassword" | "newPassword"
  ) => {
    if (field === "currentPassword") {
      setShowCurrentPassword((prev) => !prev);
    } else if (field === "newPassword") {
      setShowNewPassword((prev) => !prev);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await ApiAuth.put("/user/change-password", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access?.userToken,
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
    <div className="bg-white p-4">
      <h4 className="text-[18px]">Update Password</h4>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-col md:flex-row">
          <div className="flex flex-col w-full">
            <label
              htmlFor="currentPassword"
              className="text-[14px] font-body text-[#686868] py-2"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-[100%] md:w-[90%] lg:w-[90%] border border-[#7070702E] bg-transparent rounded-md"
              />
              <span
                className="absolute top-1/2 right-4 cursor-pointer transform -translate-y-1/2"
                onClick={() => togglePasswordVisibility("currentPassword")}
              >
                {showCurrentPassword ? (
                  <IoEyeOutline size={20} />
                ) : (
                  <IoEyeOffOutline size={20} />
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-col w-full">
            <label
              htmlFor="newPassword"
              className="text-[16px] text-[#686868] py-2"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-[100%] md:w-[90%] lg:w-[90%] border border-[#7070702E] bg-transparent rounded-md"
              />
              <span
                className="absolute top-1/2 right-4 cursor-pointer transform -translate-y-1/2"
                onClick={() => togglePasswordVisibility("newPassword")}
              >
                {showNewPassword ? (
                  <IoEyeOutline size={20} />
                ) : (
                  <IoEyeOffOutline size={20} />
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 pr-0 md:pr-6 lg:p-8  flex justify-end">
          <CustomButton
            text={isSubmitting ? "Updating..." : "Update Password"}
            bgColor="#6C1EEB"
            hover="#3944BC"
            fontSize="14px"
            type="submit"
            opacity={
              formData.currentPassword && formData.newPassword ? "1" : "0.5"
            }
          />
        </div>
      </form>
    </div>
  );
}

export default UpdatePassword;
