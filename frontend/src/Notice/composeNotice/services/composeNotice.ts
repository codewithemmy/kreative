import ApiAuth from "../../../api/ApiAuth";
import { errorNotifier, successNotifier } from "../../../utilities/Toast";

interface FormData {
  noticeType: string;
  image?: File | null;
  date?: string;
  time?: string;
  title?: string;
  content?: string;
  accountType?: string;
  classId?: string;
}

interface AdminAccess {
  userId: string;
  userToken: string;
  accountType: string;
}

export const handleCamposeNotice = async (
  formData: FormData,
  adminAccess: AdminAccess | null,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  onClose: () => void
): Promise<void> => {
  console.log(formData);

  try {
    await ApiAuth.post(`/notice`, formData, {
      headers: {
        Authorization: "Bearer " + adminAccess?.userToken,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("created");
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
