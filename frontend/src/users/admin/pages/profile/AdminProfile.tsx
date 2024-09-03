import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import avatar from "../../../../assets/avartar.jpeg";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import CustomModal from "../../../../utilities/CustomModal";
import CustomButton from "../../../../customBtn";


function AdminProfile() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [adminDetail, setAdminDetail] = useState<any | null>(null);
  const branchName = location.state.branchName;
  const { adminAccess } = useContext(Context);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const closeEndModal = () => {
    setShowModal(false);
  };

  const handleDelete = async () => {
    closeEndModal();
    setIsLoading(true);
    try {
      const response = await ApiAuth.delete(`/admin/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminAccess?.userToken}`,
        },
      });
      setIsLoading(false);
      successNotifier("Account deleted successfully!");
      navigate("/admin/settings");
    } catch (err) {
      errorNotifier(
        "Account could not delete, please contact the administrator"
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (id === undefined || id === null) {
      return;
    }
    if (!location.state.adminList || !Array.isArray(location.state.adminList)) {
      return;
    }
    const admin = location.state.adminList.find(
      (admin: any) => admin?._id === id
    );
    if (!admin) {
      errorNotifier("Admin not found");
    }
    setAdminDetail(admin || null);
  }, [id]);

  const goBack = () => {
    window.history.back();
  };

  return (
    <>
      <Wrapper>
        <section className="w-full px-4 md:px-12 pb-12">
          <div className="flex justify-between items-center p-2 md:p-8 lg:p-12 mt-3">
            <h1 className="text-primary font-semibold text-xl md:text-2xl flex">
              Admin Details
            </h1>
            <button
              className="px-[20px] py-[10px] border-[.5px] border-primary md:m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
              onClick={goBack}
            >
              Back
            </button>
          </div>
          <div className="my-6 gap-10 bg-white rounded-xl p-4 box-border">
            <div key={adminDetail?._id}>
              <div className="">
                <div className="w-[300px] h-[300px] rounded-md overflow-hidden mb-8">
                  <img
                    className="w-full h-full"
                    src={adminDetail?.image || avatar}
                    alt="admin"
                  />
                </div>
                <div className="col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className=" font-medium text-gray-800">Name:</p>
                      <p className="font-thin text-gray-600">
                        {adminDetail?.fullName}
                      </p>
                    </div>
                    <div>
                      <p className=" font-medium text-gray-800">Email:</p>
                      <p className="font-thin text-gray-600">
                        {adminDetail?.email}
                      </p>
                    </div>
                    <div>
                      <p className=" font-medium text-gray-800">
                        Phone Number:
                      </p>
                      <p className="font-thin text-gray-600">
                        {adminDetail?.phone}
                      </p>
                    </div>
                    <div>
                      <p className=" font-medium text-gray-800">Branch:</p>
                      <p className="font-thin text-gray-600">
                        {adminDetail?.accountType === "admin"
                          ? branchName
                          : "Super Admin"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between px-4">
            <CustomButton
              type="button"
              onClick={handleOpenModal}
              text={isLoading ? "Deleting..." : "Delete Account"}
              bgColor="red"
              hover="red"
            />
            {showModal && (
              <CustomModal
                action={"delete"}
                type={"Account"}
                id={id}
                onConfirm={handleDelete}
                onCancel={closeEndModal}
              />
            )}
            <Link to="/admin/settings">
              <button className="px-[20px] py-[10px] border-[.5px] border-primary my-8 md:my-6 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition">
                Close
              </button>
            </Link>
          </div>
        </section>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.section`
  .adminsProfile__section {
    background: #f1f3f9;

    .adminsProfile__heading {
      color: #1f155e;
    }
    .close__button {
      background: #193aba;
      color: white;
      text-transform: capitalize !important;
      border-radius: 50px !important;
      padding: 12px 36px;
      font-weight: bold;
      font-size: 15px;
      border: 1px solid #193aba;
    }
  }
`;

export default AdminProfile;
