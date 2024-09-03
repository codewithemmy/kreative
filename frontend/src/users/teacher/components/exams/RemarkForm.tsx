import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import CustomButton from "../../../../utilities/CustomButton";

interface FormData {
  studentId: string;
  classId: string;
  schoolTerm: string;
  position?: number;
  resumptionDate: string;
  comments: string;
}

interface Props {
  studentId: string;
}

const RemarkForm: React.FC<Props> = ({ studentId }) => {
  const { access, selectedTerm, sent, setSent } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    if(data?.position){
      data.position = Number(data.position);
    }
    try {
      const response = await ApiAuth.post(`/remarks`, data, {
        headers: {
          Authorization: "Bearer " + access?.userToken,
        },
      });
      setSent(!sent);
      setIsLoading(false);
      reset();
      successNotifier("Success!");
    } catch (error) {
      setIsLoading(false);
      setSent(!sent);
      console.error("Error:", error);
      errorNotifier("Error!");
    }
  };

  return (
    <div className="w-full p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg">
        {/* <div className="mb-6">
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-[#535353]">
              Position
            </label>
            <input
              type="number"
              {...register("position")}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
            />
          </div>
        </div> */}

        <div className="mb-6 ">
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-[#535353]">
              Resumption Date
            </label>
            <input type="date"
              {...register("resumptionDate")}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block mb-2 text-sm font-medium text-[#535353]">
            Teacher's Remarks
          </label>
          <textarea
            {...register("comments")}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
          />
        </div>

        <input
          hidden
          {...register("studentId")}
          value={studentId}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
        />

        <input
          hidden
          {...register("classId")}
          value={access?.classId}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
        />

        <input
          hidden
          {...register("schoolTerm")}
          value={selectedTerm}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
        />

        <div className="flex justify-center items-center w-[100%]">
          <CustomButton
            text={isLoading ? "Submitting..." : "Submit"}
            width="350px"
          />
        </div>
      </form>
    </div>
  );
};

export default RemarkForm;
