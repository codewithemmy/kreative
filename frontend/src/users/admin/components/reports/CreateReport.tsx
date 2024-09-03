import React, {
  useState,
  useContext,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import ViewModal from "../../../../header/ViewModal";
import CustomButton from "../../../../utilities/CustomButton";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import { successNotifier, errorNotifier } from "../../../../utilities/Toast";

interface FormDataState {
  subject: string;
  message?: string;
  image?: File | null;
}

interface CreateReportProps {
  onClose: () => void;
}

function CreateReport({ onClose }: CreateReportProps) {
  const { access } = useContext(Context);
  const [formData, setFormData] = useState<FormDataState>({
    subject: "",
    message: "",
    image: null,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files && e.target.files[0];
    if (image) {
      setSelectedFileName(image.name);
      setFormData((prevFormData) => ({
        ...prevFormData,
        image,
      }));
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleCloseModal = () => {
    onClose();
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(formData);

    const formDatas = new FormData();
    formDatas.append("subject", formData?.subject);
    if (formData.message) {
      formDatas.append("message", formData.message);
    }
    if (formData.image) {
      formDatas.append("image", formData.image);
    }

    try {
      const response = await ApiAuth.post("/report", formDatas, {
        headers: {
          Authorization: "Bearer " + (access?.userToken || ""),
          "Content-Type": "multipart/form-data",
        },
      });
      successNotifier("Report Sent successfully");
      console.log(response.data);
    } catch (error) {
      errorNotifier("Failed to send Report");
    }

    setIsLoading(false);
    handleCloseModal();
  };

  return (
    <div>
      <ViewModal isVisible={true} onClose={onClose} text="Create Report">
        <div className="p-6">
          <div className="flex flex-col">
            <label htmlFor="" className="text-[#535353] my-4">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              className="bg-[#F8F8F8] border border-[#7070701A] rounded-md"
              value={formData.subject}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col my-6">
            <label htmlFor="" className="text-[#535353] my-4">
              Description
            </label>
            <textarea
              name="message"
              cols={30}
              rows={10}
              className="bg-[#F8F8F8] border border-[#7070701A] rounded-md"
              value={formData.message}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="flex flex-col my-6">
            <button
              type="button"
              className="border border-[#342a2a1a] text-black font-bold py-2 px-4 rounded"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload File
            </button>
            <p>{selectedFileName}</p>
            <input
              type="file"
              name="file"
              className="hidden"
              onChange={handleFileInputChange}
              ref={fileInputRef}
            />
          </div>
          <CustomButton
            text={isLoading ? "Sending ..." : "Send Report"}
            width="100%"
            onClick={handleSubmit}
          />
        </div>
      </ViewModal>
    </div>
  );
}

export default CreateReport;
