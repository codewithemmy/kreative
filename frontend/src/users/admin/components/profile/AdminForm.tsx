import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import ViewModal from "../../../../header/ViewModal";
import CustomButton from "../../../../utilities/CustomButton";


interface FormData {
  fullName: string;
  email: string;
  accountType: string;
  branchId: string;
}

interface Props {
  onClose: () => void;
}

function AdminForm({ onClose }: Props) {
  const { adminAccess, sent, setSent } = useContext(Context);
  const [branchList, setBranchList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormData>();

  const handleGetClass = async () => {
    try {
      const response = await ApiAuth.get(`/branch`, {
        headers: {
          Authorization: "Bearer " + adminAccess?.userToken,
        },
      });
      setIsLoading(false);
      setBranchList(response?.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetClass();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.post(`/admin`, data, {
        headers: {
          Authorization: "Bearer " + adminAccess?.userToken,
        },
      });
      setIsLoading(false);
      setSent(!sent);
      reset();
      successNotifier("Admin created successfully!");
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
      errorNotifier("Error creating admin");
    }
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <div>
      <ViewModal
        isVisible={true}
        onClose={handleCloseModal}
        text="Users Details"
      >
        <div className="p-6">
          <p className="text-[#8A8A8A] text-[20px] md:text-[28px] mb-3">
            Create New Admin
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-lg"
          >
            <div className="mb-6">
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-[#535353]">
                  Name
                </label>
                <input
                  type="text"
                  {...register("fullName", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
                />
              </div>
            </div>

            <div className="mb-6 ">
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-[#535353]">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block mb-2 text-sm font-medium text-[#535353]">
                Type
              </label>
              <select
                {...register("accountType", { required: true })}
                className="w-full text-[#535353] text-sm px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
              >
                <option value="admin">Admin</option>
                <option value="superAdmin">SuperAdmin</option>
              </select>
            </div>

            <div className="mb-8">
              <label className="block mb-2 text-sm font-medium text-[#535353]">
                Branch
              </label>
              <select
                {...register("branchId", { required: true })}
                className="w-full text-[#535353] text-sm px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
              >
                <option value="">Assign Branch</option>
                {branchList.map((branch) => (
                  <option key={branch?._id} value={branch?._id} className="">
                    {branch?.branchName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center items-center w-[100%]">
              <CustomButton
                text={isLoading ? "Creating..." : "Create Admin"}
                width="350px"
              />
            </div>
          </form>
        </div>
      </ViewModal>
    </div>
  );
}

export default AdminForm;
