import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import ViewModal from "../../../../header/ViewModal";
import CustomButton from "../../../../utilities/CustomButton";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";

interface FormData {
  name: string;
  tag: string;
  level: string;
  image: File | null;
}

interface Props {
  id: string | undefined;
  onClose: () => void;
}

function EditClassForm({ onClose, id }: Props) {
  const { adminAccess, sent, setSent } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm<FormData>();
  const [files, setFiles] = useState<File | null>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "")
    );
    try {
      const response = await ApiAuth.patch(`/class/${id}`, filteredData, {
        headers: {
          Authorization: `Bearer ${adminAccess?.userToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      reset();
      setFiles(null);
      setSent(!sent);
      setIsLoading(false);
      successNotifier("Class updated successfully!");
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
      errorNotifier("Error updating class");
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
          <p className="text-[#8A8A8A] text-[20px] md:text-[28px] my-4">
            EditClass
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-lg"
          >
            <div>
              <div className="upload__area__1 border border-dashed border-gray-400 rounded-xl">
                <label
                  htmlFor="img"
                  className="flex justify-center items-center flex-col mt-9"
                >
                  <i className="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
                  <span className="text-gray-400 font-semibold">Photo*</span>
                </label>
                {files && (
                  <div>
                    <img
                      src={URL.createObjectURL(files)}
                      style={{
                        width: "100%",
                        height: "160px",
                        objectFit: "cover",
                      }}
                      alt="preview"
                    />
                  </div>
                )}
              </div>
              <input
                type="file"
                hidden
                id="img"
                className=""
                onChange={(e) => {
                  e.preventDefault();
                  e?.target?.files && setFiles(e?.target?.files[0]);
                  e?.target?.files && setValue("image", e?.target?.files[0]);
                }}
                placeholder="Upload Your Files"
              />
            </div>

            <div className="mb-8">
              <div className="">
                <label className="block mb-2 text-sm font-medium text-[#535353]">
                  Class Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
                />
              </div>
            </div>

            <div className="mb-8">
              <div className="">
                <label className="block mb-2 text-sm font-medium text-[#535353]">
                  Class Tag
                </label>
                <input
                  type="text"
                  {...register("tag")}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block mb-2 text-sm font-medium text-[#535353]">
                Level
              </label>
              <select
                {...register("level")}
                className="w-full text-[#535353] text-sm px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-[#F8F8F8]"
              >
                  <option value="Nursery">Nursery</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
              </select>
            </div>

            <div className="flex justify-center items-center w-[100%]">
              <CustomButton
                text={isLoading ? "Updating..." : "Update Class"}
                width="350px"
              />
            </div>
          </form>
        </div>
      </ViewModal>
    </div>
  );
}

export default EditClassForm;
