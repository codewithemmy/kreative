import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaBook } from "react-icons/fa";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import CustomModal from "../../../../utilities/CustomModal";
import placeholder from "../../../../assets/placeholder.png";
import CustomButton from "../../../../customBtn";
import ApiAuth from "../../../../api/ApiAuth";
import { Context } from "../../../../context/Context";
import EditBranchForm from "../../components/branches/EditBranchForm";

function BranchDetails() {
  const location = useLocation();
  const [branchDetails, setBranchDetails] = useState<any | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminAccess } = useContext(Context);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const closeEndModal = () => {
    setShowModal(false);
  };

  const handleEditModal = () => {
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
  };

  const handleDelete = async () => {
    closeEndModal();
    setIsLoading(true);
    try {
      const response = await ApiAuth.delete(`/branch/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminAccess?.userToken}`,
        },
      });
      setIsLoading(false);
      successNotifier("Branch deleted successfully!");
      navigate("/admin/branches");
    } catch (err) {
      errorNotifier(
        "Branch could not delete, please contact the administrator"
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (
      !location.state.branchList ||
      !Array.isArray(location.state.branchList)
    ) {
      return;
    }
    if (id === undefined || id === null) {
      return;
    }
    const myClass = location.state?.branchList.find(
      (item: any) => item?._id === id
    );
    setBranchDetails(myClass);
  }, [id, location.state]);

  const goBack = () => {
    window.history.back();
  };

  return (
    <section className="w-full px-4 md:px-12 pb-12">
      <div className="flex justify-between items-center p-2 md:p-8 lg:p-12 mt-3">
        <h1 className="text-primary font-semibold text-xl md:text-2xl flex">
          Branch Details
        </h1>
        <button
          className="px-[20px] py-[10px] border-[.5px] border-primary md:m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
          onClick={goBack}
        >
          Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg box-border p-8">
        <div className="">
          <div className="mx-auto h-[300px] md:h-[400px] w-full md:w-[80%] shadow-md rounded-lg overflow-hidden">
            <img
              className="h-full w-full"
              src={branchDetails?.image || placeholder}
              alt={branchDetails?.branchName}
            />
          </div>
        </div>

        <div className="mt-8 md:mt-10">
          <div className="flex flex-col">
            <div className="flex items-center justify-center py-3">
              <h1 className="text-primary font-semibold text-lg md:text-xl lg:text-2xl mr-4 md:mr-[300px]">
                {branchDetails?.branchName}
              </h1>
              <span className="text-lg md:text-xl text-gray-500">
                Location: {branchDetails?.location}
              </span>
            </div>
            <div className="mt-4 text-sm mx-auto w-full md:w-[90%] font-light text-hover text-justify lg:px-[200px]">
              {branchDetails?.address}
            </div>
          </div>
          <div className="flex w-[180px] bg-orange-800 text-white px-3 py-2 rounded-3xl mt-8 md:mt-[80px] md:ml-[20px] lg:ml-[70px]  items-center">
            <FaBook />
            <button className="text-white px-3 py-2">About branch</button>
          </div>
        </div>
        <div className="font-serif mt-4 text-justify mx-auto w-full md:w-[85%] ">
          {branchDetails?.description}
        </div>
      </div>
      <div className="px-4">
          <button
            onClick={handleEditModal}
            className="px-[20px] py-[10px] border-[.5px] border-primary my-4 md:my-6 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
          >
            Edit Branch
          </button>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between px-4 my-2 md:my-4">
          <CustomButton
            type="button"
            onClick={handleOpenModal}
            text={isLoading ? "Deleting..." : "Delete Branch"}
            bgColor="red"
            hover="red"
          />
          {showModal && (
            <CustomModal
              id={id}
              action={"delete"}
              type={"Branch"}
              onConfirm={handleDelete}
              onCancel={closeEndModal}
            />
          )}
          <Link to="/admin/branches">
            <button className="px-[20px] py-[10px] border-[.5px] border-primary text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition mb-6 md:mb-0">
              Close
            </button>
          </Link>
        </div>
      {editModal && <EditBranchForm id={id} onClose={closeEditModal}/>}
    </section>
  );
}

export default BranchDetails;
