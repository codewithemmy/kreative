import React, { useState, useEffect, ChangeEvent } from "react";
import Arrow from "../../assets/thickArrowForward.svg";
import RichTextEditor, { EditorValue } from "react-rte";
import { handleEditNotice } from "./services/edit";
import ViewModal from "../../header/ViewModal";
import CustomButton from "../../customBtn";

interface EditAssignmentProps {
  selectedAccount?: string;
  selectedNotice?: string;
  onClose?: () => void;
  datum?: {
    _id: string;
    title: string;
    notice: string;
  };
}

const EditAssignment: React.FC<EditAssignmentProps> = ({
  selectedAccount = "",
  selectedNotice = "",
  onClose = () => {},
  datum = { _id: "", title: "", notice: "" },
})  => {
  const [mailTitle, setMailTitle] = useState<string>(datum?.title || "");
  const [mailContent] = useState<string>(datum?.notice || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [editorState, setEditorState] = useState<EditorValue>(
    RichTextEditor.createEmptyValue()
  );

  useEffect(() => {
    setFormData({
      title: mailTitle,
      notice: mailContent,
      noticeType: selectedNotice,
      accountType: selectedAccount,
    });
  }, [datum, mailTitle, mailContent, selectedNotice, selectedAccount]);

  const [formData, setFormData] = useState({
    title: mailTitle,
    notice: mailContent,
    noticeType: selectedNotice,
    accountType: selectedAccount,
  });

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMailTitle(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      title: value,
    }));
  };

  const handleContentChange = (value: EditorValue) => {
    setEditorState(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      notice: value.toString("html"),
    }));
  };

  const handleFormSubmit = async () => {
    setIsLoading(true);
    const mailContent = editorState.toString("html");
    const formData = {
      title: mailTitle,
      notice: mailContent,
      noticeType: selectedNotice,
      accountType: selectedAccount,
    };
    await handleEditNotice(datum, formData, setIsLoading, onClose || (() => {}));
  };

  return (
    <>
      <ViewModal isVisible={true} onClose={onClose} text="Account Type">
        <div className="w-full h-full bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-[95%] md:w-[100%] lg:w-[100%] h-[55%] md:h-[65%] lg:h-[90%] relative">
            <h2 className="my-2">Compose Blog</h2>
            <input
              type="text"
              placeholder="Title of the mail"
              value={mailTitle}
              onChange={handleTitleChange}
              className="w-[100%] my-6 font-semibold rounded-md h-12"
            />
            <style>
              {`.RichTextEditor__editor___1QqIU .public-DraftEditor-content {
                    height: 300px;
                }`}
            </style>
            <RichTextEditor
              rootStyle={{ fontFamily: "Trenda-regular" }}
              value={editorState}
              onChange={handleContentChange}
            />
            <div className="absolute bottom-0 right-0 flex items-center justify-center m-4 bg-primary rounded-md px-6">
              <CustomButton
                type="button"
                text={isLoading ? "Sending..." : "Send Mail"}
                width="110px"
                hover="#076059"
                onClick={handleFormSubmit}
              />
              <img src={Arrow} alt="" className="h-[15px]" />
            </div>
          </div>
        </div>
      </ViewModal>
    </>
  );
};

export default EditAssignment;
