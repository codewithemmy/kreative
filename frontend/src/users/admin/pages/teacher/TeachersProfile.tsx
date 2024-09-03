import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import CustomModal from "../../../../utilities/CustomModal";
import CustomButton from "../../../../customBtn";
import ApiAuth from "../../../../api/ApiAuth";
import { Context } from "../../../../context/Context";

function TeachersProfile() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [teacherDetails, setTeacherDetails] = useState<any | null>(null);
  const [files, setFiles] = useState<File | null>();
  const [editedTeacherDetails, setEditedTeacherDetails] = useState<any | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [branchList, setBranchList] = useState<any[]>([]);
  const classname = location.state?.classname;
  const { adminAccess, adminDetails, sent, setSent, loadAdminDetails } = useContext(Context);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const closeEndModal = () => {
    setShowModal(false);
  };

  const handleGetClass = async () => {
    if (!adminDetails) {
      loadAdminDetails();
      return
    }
    try {
      const response = await ApiAuth.get(
        `/class?branchId=${adminDetails?.[0]?.branchId}`,
        {
          headers: {
            Authorization: "Bearer " + adminAccess?.userToken,
          },
        }
      );
      setIsLoading(false);
      setBranchList(response?.data.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (adminDetails) {
      handleGetClass();
    }
  }, [adminDetails]);

  useEffect(() => {
    handleGetClass();
  }, []);

  useEffect(() => {
    handleGetClass();
    setTeacherDetails((prevTeacherDetails: any) => ({
      ...prevTeacherDetails,
      ...editedTeacherDetails,
    }));
  }, [sent]);

  const handleSaveEdit = async () => {
    setIsSaving(true);
    const filteredData = Object.fromEntries(
      Object.entries(editedTeacherDetails).filter(([_, value]) => value !== "")
    );
    try {
      const response = await ApiAuth.patch(`/user/update/${id}`, filteredData, {
        headers: {
          Authorization: `Bearer ${adminAccess?.userToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setFiles(null);
      setSent(!sent);
      successNotifier("Teacher details updated successfully!");
      setIsSaving(false);
      setIsEditing(false);
    } catch (err) {
      setIsSaving(false);
      setIsEditing(false);
      errorNotifier(
        "Failed to update teacher details. Please try again later."
      );
    }
  };

  const handleDelete = async () => {
    closeEndModal();
    setIsLoading(true);
    try {
      const response = await ApiAuth.delete(`/user/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminAccess?.userToken}`,
        },
      });
      setIsLoading(false);
      successNotifier("Account deleted successfully!");
      navigate("/admin/teachers");
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
    if (
      !location.state.teachersList ||
      !Array.isArray(location.state.teachersList)
    ) {
      return;
    }

    const teacher = location.state.teachersList.find(
      (teacher: any) => teacher._id === id
    );

    if (!teacher) {
      errorNotifier("Teacher not found");
    }

    setTeacherDetails(teacher || null);
  }, [id]);

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    if (location.state.isTrue === true) {
      setIsEditing(true);
    }
  }, []);

  const formattedDateOfBirth = teacherDetails?.dateOfBirth?.slice(0, 10);

  return (
    <>
      <Wrapper>
        <section className="w-full px-4 md:px-12 pb-12">
          <div className="flex justify-between items-center p-2 md:p-8 lg:p-12 mt-3">
            <h1 className="text-primary font-semibold text-xl md:text-2xl flex">
              Teacher Profile
            </h1>
            <button
              className="px-[20px] py-[10px] border-[.5px] border-primary md:m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
              onClick={goBack}
            >
              Back
            </button>
          </div>
          <div className="lg:hidden px-4">
            <button
              onClick={() => {
                if (isEditing) {
                  handleSaveEdit();
                } else {
                  setIsEditing(true);
                }
              }}
              className="px-[20px] py-[10px] border-[.5px] border-primary md:my-6 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
            >
              {isSaving
                ? "Saving"
                : isEditing
                ? "Save Changes"
                : "Edit Teacher"}
            </button>
          </div>
          {isEditing ? (
            <div className="my-6 gap-10 bg-white rounded-xl p-4 box-border">
              <div key={teacherDetails?._id}>
                <div className="">
                  <div className="w-[300px] h-[300px] rounded-md overflow-hidden mb-8">
                    <div className="upload__area__1 border border-dashed border-gray-400 rounded-xl">
                      <label
                        htmlFor="img"
                        className="flex justify-center items-center flex-col mt-9"
                      >
                        <i className="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
                        <span className="text-gray-400 font-semibold">
                          Photo*
                        </span>
                      </label>
                      <div className="mt-[-20px]">
                        <img
                          src={
                            files
                              ? URL.createObjectURL(files)
                              : teacherDetails?.profileImage
                          }
                          style={{
                            width: "100%",
                            height: "160px",
                            objectFit: "cover",
                          }}
                          className=""
                          alt="preview"
                        />
                      </div>
                    </div>
                    <input
                      type="file"
                      hidden
                      id="img"
                      onChange={(e) => {
                        e.preventDefault();
                        e?.target?.files && setFiles(e?.target?.files[0]);
                        e?.target?.files &&
                          setEditedTeacherDetails({
                            ...editedTeacherDetails,
                            profileImage: e.target.files[0],
                          });
                      }}
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className=" font-medium text-gray-800">Name:</p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={teacherDetails?.name}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedTeacherDetails({
                              ...editedTeacherDetails,
                              name: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Class:</p>
                        <select
                          id="intendedClass"
                          onChange={(e) => {
                            setEditedTeacherDetails({
                              ...editedTeacherDetails,
                              intendedClass: e.target.value,
                            });
                          }}
                          className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                        >
                          {" "}
                          <option defaultValue="">{classname}</option>
                          <option value="None">None</option>
                          {branchList.map((branch) => (
                            <option
                              key={branch?._id}
                              value={branch?._id}
                              className=""
                            >
                              {branch?.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Phone Number:
                        </p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={teacherDetails?.phone}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedTeacherDetails({
                              ...editedTeacherDetails,
                              phone: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Address:</p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={teacherDetails?.address}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedTeacherDetails({
                              ...editedTeacherDetails,
                              address: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Email:</p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={teacherDetails?.email}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedTeacherDetails({
                              ...editedTeacherDetails,
                              email: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Subject:</p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={teacherDetails?.subject}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedTeacherDetails({
                              ...editedTeacherDetails,
                              subject: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Marital Status:
                        </p>
                        <select
                          id="gender"
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedTeacherDetails({
                              ...editedTeacherDetails,
                              maritalStatus: e.target.value,
                            });
                          }}
                          className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                        >
                          <option defaultValue="">
                            {teacherDetails?.maritalStatus}
                          </option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                        </select>
                      </div>

                      <div>
                        <p className=" font-medium text-gray-800">Gender:</p>
                        <select
                          id="gender"
                          onChange={(e) => {
                            setEditedTeacherDetails({
                              ...editedTeacherDetails,
                              gender: e.target.value,
                            });
                          }}
                          className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                        >
                          <option defaultValue="">
                            {teacherDetails?.gender}
                          </option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Date of Birth:
                        </p>
                        <input
                          type="date"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={formattedDateOfBirth}
                          onChange={(e) => {
                            setEditedTeacherDetails({
                              ...editedTeacherDetails,
                              dateOfBirth: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          House Details:
                        </p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={teacherDetails?.houseNameColor}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedTeacherDetails({
                              ...editedTeacherDetails,
                              houseNameColor: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Referee:</p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={teacherDetails?.referee}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedTeacherDetails({
                              ...editedTeacherDetails,
                              referee: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Referee Address:
                        </p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={teacherDetails?.refereeAddress}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedTeacherDetails({
                              ...editedTeacherDetails,
                              refereeAddress: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Hometown:</p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={teacherDetails?.homeTown}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedTeacherDetails({
                              ...editedTeacherDetails,
                              homeTown: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">State:</p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={teacherDetails?.state}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedTeacherDetails({
                              ...editedTeacherDetails,
                              state: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">LGA:</p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={teacherDetails?.localGovernmentArea}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedTeacherDetails({
                              ...editedTeacherDetails,
                              localGovernmentArea: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Nationality:
                        </p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={teacherDetails?.nationality}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedTeacherDetails({
                              ...editedTeacherDetails,
                              nationality: e.target.value,
                            });
                          }}
                        />
                      </div>
                      {/* Add more details here */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="my-6 gap-10 bg-white rounded-xl p-4 box-border">
              <div key={teacherDetails?._id}>
                <div className="">
                  <div className="w-[300px] h-[300px] rounded-md overflow-hidden mb-8">
                    <img
                      className="w-full h-full"
                      src={teacherDetails?.profileImage}
                      alt="student"
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className=" font-medium text-gray-800">Name:</p>
                        <p className="font-thin text-gray-600">
                          {teacherDetails?.name}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Class:</p>
                        <p className="font-thin text-gray-600">{classname}</p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Phone Number:
                        </p>
                        <p className="font-thin text-gray-600">
                          {teacherDetails?.phone}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Address:</p>
                        <p className="font-thin text-gray-600">
                          {teacherDetails?.address}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Email:</p>
                        <p className="font-thin text-gray-600">
                          {teacherDetails?.email}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Subject:</p>
                        <p className="font-thin text-gray-600">
                          {teacherDetails?.subject}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Marital Status:
                        </p>
                        <p className="font-thin text-gray-600">
                          {teacherDetails?.maritalStatus}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Gender:</p>
                        <p className="font-thin text-gray-600">
                          {teacherDetails?.gender}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Date of Birth:
                        </p>
                        <p className="font-thin text-gray-600">
                          {formattedDateOfBirth}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          House Details:
                        </p>
                        <p className="font-thin text-gray-600">
                          {teacherDetails?.houseNameColor}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Referee:</p>
                        <p className="font-thin text-gray-600">
                          {teacherDetails?.referee}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Referee Address:
                        </p>
                        <p className="font-thin text-gray-600">
                          {teacherDetails?.refereeAddress}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Hometown:</p>
                        <p className="font-thin text-gray-600">
                          {teacherDetails?.homeTown}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">State:</p>
                        <p className="font-thin text-gray-600">
                          {teacherDetails?.state}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">LGA:</p>
                        <p className="font-thin text-gray-600">
                          {teacherDetails?.localGovernmentArea}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Nationality:
                        </p>
                        <p className="font-thin text-gray-600">
                          {teacherDetails?.nationality}
                        </p>
                      </div>
                      {/* Add more details here */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="hidden lg:block px-4">
            <button
              onClick={() => {
                if (isEditing) {
                  handleSaveEdit();
                } else {
                  setIsEditing(true);
                }
              }}
              className="px-[20px] py-[10px] border-[.5px] border-primary my-4 md:my-6 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
            >
              {isSaving
                ? "Saving"
                : isEditing
                ? "Save Changes"
                : "Edit Student"}
            </button>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between px-4 my-2 md:my-4">
            <CustomButton
              type="button"
              onClick={handleOpenModal}
              text={isLoading ? "Deleting..." : "Delete Account"}
              bgColor="red"
              hover="red"
            />
            {showModal && (
              <CustomModal
                id={id}
                action={"delete"}
                type={"Account"}
                onConfirm={handleDelete}
                onCancel={closeEndModal}
              />
            )}
            <button
              onClick={goBack}
              className="px-[20px] py-[10px] border-[.5px] border-primary my-8 md:my-6 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition mb-6 md:mb-0"
            >
              Close
            </button>
          </div>
        </section>
      </Wrapper>
    </>
  );
}
const Wrapper = styled.section`
  .messages__section {
    background: #f1f3f9;

    .messages__heading {
      color: #1f155e;
    }
  }
`;

export default TeachersProfile;
