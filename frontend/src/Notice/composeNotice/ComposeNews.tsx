import React, { useState, ChangeEvent, useContext } from "react";
import Bold from "../../assets/bold.svg";
import Italics from "../../assets/italics.svg";
import Arrow from "../../assets/thickArrowForward.svg";
import { handleCamposeNotice } from "./services/composeNotice";
import ViewModal from "../../header/ViewModal";
import CustomButton from "../../utilities/CustomButton";
import { Context } from "../../context/Context";

interface ComposeNewsProps {
  selectedAccount: string;
  selectedNotice: string;
  onClose: () => void;
}

const ComposeNews: React.FC<ComposeNewsProps> = ({
  selectedAccount,
  selectedNotice,
  onClose,
}) => {
  const [mailTitle, setMailTitle] = useState("");
  const [mailContent, setMailContent] = useState("");
  const [boldEnabled, setBoldEnabled] = useState(false);
  const [italicEnabled, setItalicEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(
    null
  );
  const { adminAccess } = useContext(Context);
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setSelectedImageFile(file || null);
    setSelectedImageName(file ? file.name : null);
  };

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    noticeType: selectedNotice,
    accountType: selectedAccount,
    image: selectedImageFile,
  });

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMailTitle(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      title: value,
    }));
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMailContent(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      content: value,
    }));
  };

  const handleBoldToggle = () => {
    setBoldEnabled(!boldEnabled);
  };

  const handleItalicToggle = () => {
    setItalicEnabled(!italicEnabled);
  };

  const handleFormSubmit = async () => {
    setIsLoading(true);
    await handleCamposeNotice(formData, adminAccess, setIsLoading, onClose);
  };

  return (
    <ViewModal isVisible={true} onClose={onClose} text="Account Type">
      <div className="w-full h-full bg-opacity-50">
        <div className="bg-white p-4 rounded-lg w-[95%] md:w-[100%] lg:w-[100%] h-[55%] md:h-[65%] lg:h-[90%] relative">
          <h2 className="my-2">Compose Email</h2>
          <input
            type="text"
            placeholder="Title of the mail"
            value={mailTitle}
            onChange={handleTitleChange}
            className="w-[100%] my-6 pl-3 font-semibold rounded-md h-12"
          />
          <textarea
            placeholder="Type your mail here..."
            value={mailContent}
            onChange={handleContentChange}
            className="w-[100%] h-[70%] rounded-md relative p-2 border border-gray-300"
          />

          <div className="flex absolute bottom-[7%] md:bottom-[12%] left-6">
            <img
              src={Bold}
              alt=""
              className={`mr-4 ${boldEnabled ? "w-6 shadow-lg" : ""}`}
              onClick={handleBoldToggle}
            />
            <img
              src={Italics}
              alt=""
              className=""
              onClick={handleItalicToggle}
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="imageUpload"
              className="cursor-pointer border-primary border-2 bg-primary text-center text-white text-md font-semibold rounded-xl hover:bg-white hover:text-hover hover:border-hover focus:outline-none py-2 px-3"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            {selectedImageName && (
              <p className="mt-2 text-sm text-gray-600">{selectedImageName}</p>
            )}
          </div>

          <div className="flex items-center justify-end  my-2 md:my-4">
            <CustomButton
              text={isLoading ? "Sending..." : "Send Mail"}
              onClick={handleFormSubmit}
            />
          </div>
        </div>
      </div>
    </ViewModal>
  );
};

export default ComposeNews;
