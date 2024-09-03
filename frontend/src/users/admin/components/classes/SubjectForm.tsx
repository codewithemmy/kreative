import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import ApiAuth from "../../../../api/ApiAuth";
import ViewModal from "../../../../header/ViewModal";
import CustomButton from "../../../../utilities/CustomButton";
import { Context } from "../../../../context/Context";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";

interface FormData {
  name: string;
  classId: string;
}

interface Props {
  id: string | undefined;
  onClose: () => void;
}

function SubjectForm({ onClose, id }: Props) {
  const { adminAccess, sent, setSent } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "")
    );
    try {
      const response = await ApiAuth.post(`/subject`, filteredData, {
        headers: {
          Authorization: `Bearer ${adminAccess?.userToken}`,
        },
      });
      reset();
      setSent(!sent);
      setIsLoading(false);
      successNotifier("Subject added successfully!");
    } catch (error: any) {
      setIsLoading(false);
      errorNotifier(error?.response.data.message);
    }
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <div>
      <ViewModal isVisible={true} onClose={handleCloseModal} text="">
        <div className="p-6">
          <p className="text-[#8A8A8A] text-[20px] md:text-[28px] my-4">
            Add Subject
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-lg"
          >
            <div className="mb-8">
              <div className="">
                <label className="block mb-2 text-sm font-medium text-[#535353]">
                  Subject name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
                />
              </div>
            </div>

            <input
              hidden
              type="text"
              value={id}
              {...register("classId")}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
            />

            <div className="flex justify-center items-center w-[100%]">
              <CustomButton
                text={isLoading ? "Adding..." : "Add"}
                width="350px"
              />
            </div>
          </form>
        </div>
      </ViewModal>
    </div>
  );
}

export default SubjectForm;
