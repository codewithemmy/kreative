import React, { useContext, useState } from "react";
import AccountSettings from "../../components/profile/AccountSettings";
import AdminHeader from "../../../../header/AdminHeader";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import CustomModal from "../../../../utilities/CustomModal";
import CustomButton from "../../../../customBtn";
import Sidebar from "../../components/Sidebar";

const AdminProfileSettings: React.FC = () => {
  const { adminAccess, adminLogout, adminDetails } = useContext(Context);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const closeEndModal = () => {
    setShowModal(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.delete(`/user/delete-account`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminAccess?.userToken}`,
        },
      });
      setIsLoading(false);
      successNotifier("Account deleted successfully!");
    } catch (err) {
      errorNotifier(
        "Account could not delete, please contact the administrator"
      );
    }
    setIsLoading(false);
    adminLogout();
    closeEndModal();
  };
  return (
    <div className="md:flex min-h-full bg-[#F8F8F8] lg:px-4 lg:relative">
      <Sidebar />
      <div className="w-screen lg:w-[85%] lg:absolute lg:right-0 mt-24 lg:mt-0">
        <AdminHeader />
        <AccountSettings />
        <div className="my-4 md:my-6 flex justify-start px-8 lg:px-10">
          <CustomButton
            type="button"
            disabled={adminAccess?.accountType === "superAdmin"}
            onClick={handleOpenModal}
            opacity={adminAccess?.accountType === "superAdmin" ? "0.5" : "1"}
            text= {isLoading ? "Deleting..." : "Delete Account"}
            bgColor="red"
            hover="red"
          />
        </div>
        {showModal && (
          <CustomModal
            action={"delete"}
            type={"Account"}
            datum={adminDetails?._id}
            onConfirm={handleDelete}
            onCancel={closeEndModal}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProfileSettings;
