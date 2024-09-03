import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import CustomButton from "../../../../customBtn";
import CustomModal from "../../../../utilities/CustomModal";

function StudentProfile() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = useState<any | null>(null);
  const [files, setFiles] = useState<File | null>();
  const [editedStudentDetails, setEditedStudentDetails] = useState<any | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [branchList, setBranchList] = useState<any[]>([]);
  const classname = location.state?.classname;
  const { adminAccess, adminDetails, sent, setSent, loadAdminDetails } =
    useContext(Context);
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
      return;
    }
    try {
      const response = await ApiAuth.get(
        `/class?branchId=${adminDetails?.[0].branchId}`,
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
    setStudentDetails((prevStudentDetails: any) => ({
      ...prevStudentDetails,
      ...editedStudentDetails,
    }));
  }, [sent]);

  const handleSaveEdit = async () => {
    setIsSaving(true);
    const filteredData = Object.fromEntries(
      Object.entries(editedStudentDetails).filter(([_, value]) => value !== "")
    );
    try {
      const response = await ApiAuth.put(`/student/${id}`, filteredData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${adminAccess?.userToken}`,
        },
      });
      setFiles(null);
      setSent(!sent);
      successNotifier("Student details updated successfully!");
      setIsSaving(false);
      setIsEditing(false);
    } catch (err) {
      setIsSaving(false);
      setIsEditing(false);
      errorNotifier(
        "Failed to update student details. Please try again later."
      );
    }
  };

  const handleDelete = async () => {
    closeEndModal();
    setIsLoading(true);
    try {
      const response = await ApiAuth.delete(`/student/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminAccess?.userToken}`,
        },
      });
      setIsLoading(false);
      successNotifier("Account deleted successfully!");
      navigate("/admin/students");
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
      !location.state.studentList ||
      !Array.isArray(location.state.studentList)
    ) {
      return;
    }

    const student = location.state.studentList.find(
      (student: any) => student?._id === id
    );
    if (!student) {
      errorNotifier("Student not found");
    }

    if (location.state.isTrue === true) {
      setIsEditing(true);
    }
    console.log(student);

    setStudentDetails(student || null);
  }, [id]);

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    if (location.state.isTrue === true) {
      setIsEditing(true);
    }
  }, []);

  const formattedDateOfBirth = studentDetails?.dateOfBirth?.slice(0, 10);

  return (
    <>
      <Wrapper>
        <section className="w-full px-4 md:px-12 pb-12">
          <div className="flex justify-between items-center p-2 md:p-8 lg:p-12 mt-3">
            <h1 className="text-primary font-semibold text-xl md:text-2xl flex">
              Student Profile
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
                : "Edit Student"}
            </button>
          </div>
          {isEditing ? (
            <div className="my-6 gap-10 bg-white rounded-xl p-4 box-border">
              <div key={studentDetails?._id}>
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
                              : studentDetails?.profileImage
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
                          setEditedStudentDetails({
                            ...editedStudentDetails,
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
                          defaultValue={studentDetails?.name}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedStudentDetails({
                              ...editedStudentDetails,
                              name: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Student ID:
                        </p>
                        <p className="font-thin text-gray-600">
                          {studentDetails?.validId}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Class:</p>
                        <select
                          id="intendedClass"
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedStudentDetails({
                              ...editedStudentDetails,
                              intendedClass: e.target.value,
                            });
                          }}
                          className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                        >
                          {" "}
                          <option defaultValue="">{classname}</option>
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
                          Date of Birth:
                        </p>
                        <input
                          type="date"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={formattedDateOfBirth}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedStudentDetails({
                              ...editedStudentDetails,
                              dateOfBirth: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Gender:</p>
                        <select
                          id="gender"
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedStudentDetails({
                              ...editedStudentDetails,
                              gender: e.target.value,
                            });
                          }}
                          className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                        >
                          <option defaultValue="">
                            {studentDetails?.gender}
                          </option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Phone Number:
                        </p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={studentDetails?.phone}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedStudentDetails({
                              ...editedStudentDetails,
                              phone: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Email:</p>
                        <input
                          type="email"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={studentDetails?.email}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedStudentDetails({
                              ...editedStudentDetails,
                              email: e.target.value.toLowerCase(),
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Address:</p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={studentDetails?.address}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedStudentDetails({
                              ...editedStudentDetails,
                              address: e.target.value,
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
                          defaultValue={studentDetails?.houseNameColor}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedStudentDetails({
                              ...editedStudentDetails,
                              houseNameColor: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Parent Name:
                        </p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={studentDetails?.parentName}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedStudentDetails({
                              ...editedStudentDetails,
                              parentName: e.target.value,
                            });
                          }}
                        />
                      </div>

                      <div>
                        <p className=" font-medium text-gray-800">
                          Parent Occupation:
                        </p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={studentDetails?.parentOccupation}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedStudentDetails({
                              ...editedStudentDetails,
                              parentOccupation: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Genotype:</p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={studentDetails?.genotype}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedStudentDetails({
                              ...editedStudentDetails,
                              genotype: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Blood Group:
                        </p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={studentDetails?.bloodGroup}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedStudentDetails({
                              ...editedStudentDetails,
                              bloodGroup: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Hometown:</p>
                        <input
                          type="text"
                          className="font-thin text-gray-600 w-full pl-1"
                          defaultValue={studentDetails?.homeTown}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedStudentDetails({
                              ...editedStudentDetails,
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
                          defaultValue={studentDetails?.state}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedStudentDetails({
                              ...editedStudentDetails,
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
                          defaultValue={studentDetails?.localGovernmentArea}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedStudentDetails({
                              ...editedStudentDetails,
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
                          defaultValue={studentDetails?.nationality}
                          onChange={(e) => {
                            e.preventDefault();
                            setEditedStudentDetails({
                              ...editedStudentDetails,
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
              <div key={studentDetails?._id}>
                <div className="">
                  <div className="w-[300px] h-[300px] rounded-md overflow-hidden mb-8">
                    <img
                      className="w-full h-full"
                      src={studentDetails?.profileImage}
                      alt="student"
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className=" font-medium text-gray-800">Name:</p>
                        <p className="font-thin text-gray-600">
                          {studentDetails?.name}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Student ID:
                        </p>
                        <p className="font-thin text-gray-600">
                          {studentDetails?.validId}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Class:</p>
                        <p className="font-thin text-gray-600">{classname}</p>
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
                        <p className=" font-medium text-gray-800">Gender:</p>
                        <p className="font-thin text-gray-600">
                          {studentDetails?.gender}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Phone Number:
                        </p>
                        <p className="font-thin text-gray-600">
                          {studentDetails?.phone}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Email:</p>
                        <p className="font-thin text-gray-600">
                          {studentDetails?.email}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Address:</p>
                        <p className="font-thin text-gray-600">
                          {studentDetails?.address}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          House Details:
                        </p>
                        <p className="font-thin text-gray-600">
                          {studentDetails?.houseNameColor}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Parent Name:
                        </p>
                        <p className="font-thin text-gray-600">
                          {studentDetails?.parentName}
                        </p>
                      </div>

                      <div>
                        <p className=" font-medium text-gray-800">
                          Parent Occupation:
                        </p>
                        <p className="font-thin text-gray-600">
                          {studentDetails?.parentOccupation}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">City:</p>
                        <p className="font-thin text-gray-600">
                          {studentDetails?.homeTown}
                        </p>
                      </div>

                      <div>
                        <p className=" font-medium text-gray-800">Genotype:</p>
                        <p className="font-thin text-gray-600">
                          {studentDetails?.genotype}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">
                          Blood Group:
                        </p>
                        <p className="font-thin text-gray-600">
                          {studentDetails?.bloodGroup}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">Hometown:</p>
                        <p className="font-thin text-gray-600">
                          {studentDetails?.homeTown}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">State:</p>
                        <p className="font-thin text-gray-600">
                          {studentDetails?.state}
                        </p>
                      </div>
                      <div>
                        <p className=" font-medium text-gray-800">LGA:</p>
                        <p className="font-thin text-gray-600">
                          {studentDetails?.localGovernmentArea}
                        </p>
                      </div>

                      <div>
                        <p className=" font-medium text-gray-800">
                          Nationality:
                        </p>
                        <p className="font-thin text-gray-600">
                          {studentDetails?.nationality}
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
  .studentsProfile__section {
    background: #f1f3f9;

    .studentsProfile__heading {
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

export default StudentProfile;
