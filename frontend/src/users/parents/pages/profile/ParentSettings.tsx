import React, { useContext, useState } from "react";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import Header from "../../../../header/Header";
import CustomButton from "../../../../customBtn";
import CustomModal from "../../../../utilities/CustomModal";
import UpdatePassword from "../../components/profile/UpdateParentPassword";
import UpdateAccount from "../../components/profile/UpdateParentAccount";
import ParentSidebar from "../../components/ParentSidebar";

const ParentSettings: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false); 
  const { access, userDetails, logout } = useContext(Context);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const closeEndModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await ApiAuth.delete(`/user/delete-account`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access?.userToken}`,
        },
      });
      successNotifier("Account deleted successfully!");
    } catch (err) {
      errorNotifier(
        "Account could not be deleted, please contact the administrator" 
      );
    }
    logout();
    closeEndModal();
  };

  return (
    <div className="w-full grid grid-cols-6">
      <div className="col-span-1">
        <ParentSidebar />
      </div>
      <div className="col-span-5">
        <Header />
        <div className="p-6">
          <UpdateAccount />
          <UpdatePassword />

          <div className="mt-10 flex justify-end px-3 md:px-12">
            <CustomButton
              type="button"
              onClick={handleOpenModal}
              text="Delete Account"
              bgColor="red"
              hover="red"
            />
          </div>
          {showModal && (
            <CustomModal
              action={"delete"}
              type={"Account"}
              datum={userDetails?._id}
              onConfirm={handleDelete}
              onCancel={closeEndModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default ParentSettings;
