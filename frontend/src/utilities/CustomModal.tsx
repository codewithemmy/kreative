import React from "react";
import CustomButton from "./CustomButton";

interface CustomModalProps {
  action: string;
  id?: string;
  onConfirm: (id: string) => void;
  onCancel: () => void;
  datum?: {
    _id: string | null;
    notice: string;
    noticeType: string;
    accountType: string;
    createdAt: string;
  };
  approvalData?: {
  classId: string | undefined;
  year: string;
  schoolTerm: string;
}
  type: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  action,
  id,
  onConfirm,
  onCancel,
  datum,
  type,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md">
        <p className="text-sm font-semibold mb-4">
          Are you sure you want to {action} this {type}?
        </p>
        <div className="flex justify-around">
          <CustomButton
            text="Yes"
            width="80px"
            onClick={() => {
              if (datum?._id) {
                onConfirm(datum?._id);
              } else if (id) {
                onConfirm(id);
              }
            }}
          />
          <CustomButton text="No" width="80px" onClick={onCancel} />
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
