import { useContext } from "react";
import ApiAuth from "../../../api/ApiAuth";
import { errorNotifier, successNotifier } from "../../../utilities/Toast";
import { Context } from "../../../context/Context";

interface FormData {
  title: string;
  notice: string;
  noticeType: string;
  accountType: string;
}

export interface Datum {
  _id: string;
  title: string;
  notice: string;
}

export const handleEditNotice = async (
  datum: Datum,
  formData: FormData,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  onClose: () => void
): Promise<void> => {
  const { adminAccess, adminDetails } = useContext(Context);

  try {
    await ApiAuth.post(`/admin/Notice/${adminDetails?._id}`, formData, {
      headers: {
        Authorization: "Bearer " + adminAccess?.userToken,
      },
    });
    successNotifier("Notice Created successfully");
  } catch (error) {
    console.log(error);
    const errorMessage = "Failed to Create Notice";
    errorNotifier(errorMessage);
  } finally {
    setIsLoading(false);
    onClose();
  }
};
