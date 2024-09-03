import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import ApiAuth from "../../../../api/ApiAuth";
import ViewModal from "../../../../header/ViewModal";
import CustomButton from "../../../../utilities/CustomButton";
import { Context } from "../../../../context/Context";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";

interface FormData {
  classId: string;
  period: {
    day: string;
    type: string;
    startTime: string;
    endTime: string;
    subject: string;
  };
}

interface Props {
  subjects: any[];
  onClose: () => void;
}

function TimeTableForm({ onClose, subjects }: Props) {
  const { access, sent, setSent, selectedTerm, selectedYear } =
    useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [other, setOther] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (!subjects) {
      return;
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.post("/time-table", data, {
        headers: {
          Authorization: `Bearer ${access?.userToken}`,
        },
      });
      reset();
      setSent(!sent);
      setIsLoading(false);
      successNotifier("Time table created successfully!");
    } catch (error) {
      setIsLoading(false);
      errorNotifier("Error creating time table");
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "other") {
      setOther(true);
      setValue("period.subject", "");
    } else {
      setOther(false);
      setValue("period.subject", value);
    }
  };

  const showOther = () => {
    setOther(true);
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <div>
      <ViewModal
        isVisible={true}
        onClose={handleCloseModal}
        text="Create Time Table"
      >
        <div className="p-3">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-lg"
          >
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-[#535353]">
                Select Day
              </label>
              <select
                {...register("period.day", { required: true })}
                className="w-full text-[#535353] text-sm px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
              >
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-[#535353]">
                Select Period
              </label>
              <select
                {...register("period.type", { required: true })}
                className="w-full text-[#535353] text-sm px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
              >
                <option value="first">First</option>
                <option value="second">Second</option>
                <option value="third">Third</option>
                <option value="fourth">Fourth</option>
                <option value="fifth">Fifth</option>
                <option value="sixth">Sixth</option>
                <option value="seventh">Seventh</option>
                <option value="eight">Eight</option>
                <option value="nineth">Nineth</option>
                <option value="eleventh">Eleventh</option>
                <option value="twelveth">Twelveth</option>
                <option value="thirteenth">Thirteenth</option>
                <option value="fourtheenth">Fourtheenth</option>
              </select>
            </div>
            <div className="mb-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#535353]">
                  Starting Time
                </label>
                <input
                  type="time"
                  {...register("period.startTime", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
                />
              </div>
            </div>
            <div className="mb-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#535353]">
                  Closing Time
                </label>
                <input
                  type="time"
                  {...register("period.endTime", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-[#535353]">
                Subject
              </label>
              <select
                id="subject"
                className="w-full text-[#535353] text-sm px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
                {...register("period.subject", { required: true })}
                onChange={handleSubjectChange}
              >
                <option value="">Select subject</option>
                {subjects?.map((subject) => (
                  <option key={subject?._id} value={subject?.name}>
                    {subject?.name}
                  </option>
                ))}
                <option value="other">Others</option>
              </select>
            </div>
            {other && (
              <div className="mb-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-[#535353]">
                    Other
                  </label>
                  <input
                    type="text"
                    {...register("period.subject", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
                  />
                </div>
              </div>
            )}
            <input
              type="text"
              hidden
              value={access?.classId}
              {...register("classId", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
            />
            <div className="flex justify-center items-center w-[100%]">
              <CustomButton
                text={isLoading ? "Creating..." : "Create"}
                width="350px"
              />
            </div>
          </form>
        </div>
      </ViewModal>
    </div>
  );
}

export default TimeTableForm;
