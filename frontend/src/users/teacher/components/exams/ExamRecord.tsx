import React, { useContext, useEffect, useState } from "react";
import Header from "../../../../header/Header";
import { FaEdit, FaEye, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import TeacherSidebar from "../TeacherSidebar";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import { useForm } from "react-hook-form";
import Spinner from "../../../../utilities/Spinner";
import RemarkForm from "./RemarkForm";
import AddDomain from "./CreateDomain";
import TeachersDomain from "./TeachersDomain";

interface Record {
  subjectId?: string;
  schoolTerm?: string;
  year?: string;
  studentId?: string;
  classId?: string;
  resumptionTest?: number;
  project?: number;
  midTermTest?: number;
  examScore?: number;
}

const ExamRecord: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<string | "">("");
  const { id } = useParams();
  const location = useLocation();
  const { access, selectedTerm, sent, selectedYear } = useContext(Context);
  const [record, setRecord] = useState<any>(null);
  const [studentName, setStudentName] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [studentRecord, setStudentRecord] = useState<any[]>([]);
  const [updatedRecord, setUpdatedRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditingRemark, setIsEditingRemark] = useState(false);
  const [isAddingRemark, setIsAddingRemark] = useState(false);
  const [isUpdatingRemark, setIsUpdatingRemark] = useState(false);
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [updatedRemarks, setUpdatedRemarks] = useState<any>(null);

  setTimeout(() => {
    setIsLoading(false);
  }, 300);

  const handleGetRecords = async () => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.get(
        `/record?studentId=${id}&schoolTerm=${selectedTerm}&classId=${access?.classId}&year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${access?.userToken}`,
          },
        }
      );
      setRecord(response?.data);
      setIsLoading(false);
      setStudentRecord(response?.data?.data);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleGetSubjects = async () => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.get(
        `/subject?classId=${access?.classId}`,
        {
          headers: {
            Authorization: `Bearer ${access?.userToken}`,
          },
        }
      );
      setIsLoading(false);
      setSubjects(response?.data.data);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id === undefined || id === null) {
      return;
    }
    if (
      !location?.state?.studentList ||
      !Array.isArray(location?.state?.studentList)
    ) {
      return;
    }
    const student = location?.state?.studentList.find(
      (student: any) => student?._id === id
    );
    if (!student) {
      errorNotifier("Student not loaded");
    }
    setStudentName(student?.name);
    handleGetSubjects();
    handleGetRecords();
  }, []);

  useEffect(() => {
    handleGetRecords();
  }, [selectedYear]);

  useEffect(() => {
    handleGetRecords();
  }, [selectedTerm]);

  const { register, handleSubmit } = useForm<Record>();

  const handleAddRecord = () => {
    setIsAdding(true);
  };

  const handleEditRecord = () => {
    if (selectedRecord !== "") {
      setIsEditing(true);
    } else {
      setSelectedRecord("");
      setIsEditing(false);
    }
  };

  const handleSelectRecord = (recordId: string) => {
    if (selectedRecord === "") {
      setSelectedRecord(recordId);
    } else {
      setSelectedRecord("");
      setIsEditing(false);
    }
  };

  const handleSaveRecord = async (data: Record) => {
    setIsSaving(true);
    const recordData: Record = {
      ...data,
      resumptionTest: Number(data.resumptionTest),
      project: Number(data.project),
      midTermTest: Number(data.midTermTest),
      examScore: Number(data.examScore),
    };
    try {
      const response = await ApiAuth.post(`/record`, recordData, {
        headers: {
          Authorization: `Bearer ${access?.userToken}`,
        },
      });
      setIsSaving(false);
      setIsAdding(false);
      handleGetRecords();
      successNotifier("Record added successfully");
    } catch (error: any) {
      setIsAdding(false);
      setIsSaving(false);
      errorNotifier(error?.response?.data.message);
    }
  };

  const handleUpdateRecord = async (recordId: string) => {
    setIsUpdating(true);
    const filteredData = Object.fromEntries(
      Object.entries(updatedRecord).filter(([_, value]) => value !== "")
    );
    try {
      const response = await ApiAuth.patch(
        `/record/${recordId}`,
        filteredData,
        {
          headers: {
            Authorization: "Bearer " + access?.userToken,
          },
        }
      );
      setIsUpdating(false);
      setIsEditing(false);
      setSelectedRecord("");
      handleGetRecords();
      successNotifier("Record updated successfully");
    } catch (error: any) {
      setIsEditing(false);
      setSelectedRecord("");
      setIsUpdating(false);
      errorNotifier(error?.response?.data.message);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.delete(`/record/${recordId}`, {
        headers: {
          Authorization: "Bearer " + access?.userToken,
        },
      });
      setIsLoading(false);
      setIsUpdating(false);
      setIsEditing(false);
      setSelectedRecord("");
      handleGetRecords();
      successNotifier("Record deleted successfully");
    } catch (error: any) {
      setIsUpdating(false);
      setIsEditing(false);
      setIsLoading(false);
      setSelectedRecord("");
      errorNotifier(error?.response?.data.message);
    }
  };

  const handleSubmitUpdatedRemark = async (remarkId: string) => {
    setIsUpdatingRemark(true);
    if (updatedRemarks?.positon) {
      updatedRemarks.position = Number(updatedRemarks.position);
    }
    const filteredData = Object.fromEntries(
      Object.entries(updatedRemarks).filter(([_, value]) => value !== "")
    );
    try {
      const response = await ApiAuth.patch(
        `/remarks/${remarkId}`,
        filteredData,
        {
          headers: {
            Authorization: "Bearer " + access?.userToken,
          },
        }
      );
      setIsUpdatingRemark(false);
      setIsEditingRemark(false);
      handleGetRecords();
      successNotifier("Updated Successfully");
    } catch (error: any) {
      setIsUpdatingRemark(false);
      setIsEditingRemark(false);
      errorNotifier(error?.response?.data.message);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsUpdating(false);
    setIsEditing(false);
  };

  const handleOpenRemarkForm = () => {
    setIsAddingRemark(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleCloseRemarkForm = () => {
    setIsAddingRemark(false);
  };

  const handleOpenDomainForm = () => {
    setIsAddingDomain(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleCloseDomainForm = () => {
    setIsAddingDomain(false);
  };

  const handleOpenUpdateRemark = () => {
    setIsEditingRemark(true);
  };

  const handleCloseUpdateRemark = () => {
    setIsEditingRemark(false);
  };

  useEffect(() => {
    handleGetRecords();
    setIsAddingRemark(false);
  }, [sent]);

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="md:flex min-h-full bg-[#F8F8F8] lg:px-4 lg:relative">
      <TeacherSidebar />
      <div className="w-screen lg:w-[85%] lg:absolute lg:right-0 mt-24 lg:mt-0 px-4">
        <Header />
        <div className="w-full flex items-center justify-between mb-[10px] mt-[20px]">
          <div className="font-[400] text-[14px] md:text-[16px] text-[#CC400C] font-inter leading-[33.6px]">
            {studentName}'s Record
          </div>
          <button
            type="button"
            className="px-[20px] py-[10px] border-[.5px] border-primary text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
            onClick={goBack}
          >
            Back
          </button>
        </div>

        <div className="flex flex-col shrink-0 mt-2">
          <div className="flex flex-wrap justify-end items-center w-full rounded-sm py-2 ">
            <button
              type="button"
              onClick={handleAddRecord}
              className="flex justify-between items-center w-[132px] h-[35px] rounded-md bg-[#FFFFFF] text-[#CC400C] text-[12px] font-[400] border-[1.5px] p-[12px] border-[#CC400C] "
            >
              <div className="text-[#CC400C] ">
                <FaPlus />
              </div>{" "}
              <div>Add New Record</div>
            </button>
          </div>
          <form
            onSubmit={handleSubmit(handleSaveRecord)}
            className="table-container w-full overflow-x-auto"
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <table className="shrink-0 w-full pt-4 border border-[#535353]">
                <thead className="w-full shrink-0 border border-[#535353]">
                  <tr className="flex items-center justify-center text-left gap-x-4 w-full text-[#535353] text-[12px] shrink-0  p-1">
                    <th className="w-[120px] lg:w-[200px] shrink-0 text-center">
                      Subjects
                    </th>
                    <th className="w-[100px] lg:w-[150px] shrink-0 text-center overflow-hidden">
                      Resumption Test
                    </th>
                    <th className="w-[90px] lg:w-[120px] shrink-0 text-center">
                      Projects
                    </th>
                    <th className="w-[100px] lg:w-[150px] shrink-0 text-center">
                      Mid-Term Test
                    </th>
                    <th className="w-[80px] lg:w-[100px] shrink-0 text-center">
                      Exam
                    </th>
                    <th className="w-[80px] lg:w-[100px] shrink-0 text-center">
                      Total Score
                    </th>
                    <th className="w-[80px] lg:w-[100px] shrink-0 text-center">
                      Grade
                    </th>
                    <th className="w-[80px] lg:w-[100px] shrink-0 text-center">
                      Remark
                    </th>
                    <th className="w-[80px] lg:w-[100px] shrink-0 text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="w-full shrink-0">
                  {studentRecord?.length === 0 && !isAdding && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center mt-[10px] md:mt-[100px] font-extralight flex justify-center items-center text-gray-700 text-lg md:text-2xl py-4 gap-x-[100px]"
                      >
                        <p className="sm:hidden">Add New Record</p>
                        <p>Add New Record</p>
                        <p className="sm:hidden">Add New Record</p>
                      </td>
                    </tr>
                  )}
                  {studentRecord.map((item) => (
                    <tr
                      key={item?._id}
                      className="flex items-center justify-center text-left gap-x-4 w-full text-[#535353] shrink-0 font-thin text-[12px] p-1"
                    >
                      <td className="w-[120px] lg:w-[200px] shrink-0 text-center cursor-pointer">
                        <p
                          onClick={() => handleSelectRecord(item?._id)}
                          className="text-primary cursor-pointer"
                        >
                          {item?.subjectId?.name}
                        </p>
                      </td>
                      <td className="w-[100px] lg:w-[150px] shrink-0 text-center">
                        {selectedRecord === item?._id && isEditing ? (
                          <input
                            type="number"
                            onChange={(e) =>
                              setUpdatedRecord({
                                ...updatedRecord,
                                resumptionTest: parseInt(e.target.value),
                              })
                            }
                            defaultValue={item?.resumptionTest}
                            className="px-3 py-2 border border-primary w-full shrink-0 text-center rounded focus:outline-none focus:border-primary bg-[#F8F8F8]"
                          />
                        ) : (
                          <>{item?.resumptionTest}</>
                        )}
                      </td>
                      <td className="w-[90px] lg:w-[120px] shrink-0 text-center">
                        {selectedRecord === item?._id && isEditing ? (
                          <input
                            type="number"
                            onChange={(e) =>
                              setUpdatedRecord({
                                ...updatedRecord,
                                project: parseInt(e.target.value),
                              })
                            }
                            defaultValue={item?.project}
                            className="px-3 py-2 border border-primary w-full shrink-0 text-center rounded focus:outline-none focus:border-primary bg-[#F8F8F8]"
                          />
                        ) : (
                          <>{item?.project}</>
                        )}
                      </td>
                      <td className="w-[100px] lg:w-[150px] shrink-0 text-center">
                        {selectedRecord === item?._id && isEditing ? (
                          <input
                            type="number"
                            onChange={(e) =>
                              setUpdatedRecord({
                                ...updatedRecord,
                                midTermTest: parseInt(e.target.value),
                              })
                            }
                            defaultValue={item?.midTermTest}
                            className="px-3 py-2 border border-primary w-full shrink-0 text-center rounded focus:outline-none focus:border-primary bg-[#F8F8F8]"
                          />
                        ) : (
                          <>{item?.midTermTest}</>
                        )}
                      </td>
                      <td className="w-[80px] lg:w-[100px] shrink-0 text-center">
                        {selectedRecord === item?._id && isEditing ? (
                          <input
                            type="number"
                            onChange={(e) =>
                              setUpdatedRecord({
                                ...updatedRecord,
                                examScore: parseInt(e.target.value),
                              })
                            }
                            defaultValue={item?.examScore}
                            className="px-3 py-2 border border-primary w-full shrink-0 text-center rounded focus:outline-none focus:border-primary bg-[#F8F8F8]"
                          />
                        ) : (
                          <>{item?.examScore}</>
                        )}
                      </td>
                      <td className="w-[80px] lg:w-[100px] shrink-0 text-center">
                        {selectedRecord === item?._id && isEditing ? (
                          ""
                        ) : (
                          <> {item?.totalScore}</>
                        )}
                      </td>

                      <td className="w-[80px] lg:w-[100px] shrink-0 text-center">
                        {selectedRecord === item?._id && isEditing ? (
                          <button
                            type="button"
                            onClick={() => handleUpdateRecord(item?._id)}
                            className="px-[20px] mr-2 py-[10px] border-[.5px] border-primary md:m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
                          >
                            {isUpdating ? "Updating.." : "Update"}
                          </button>
                        ) : (
                          <> {item?.grade}</>
                        )}
                      </td>

                      <td className="w-[80px] lg:w-[100px] shrink-0 text-center">
                        {selectedRecord === item?._id && isEditing ? (
                          <button
                            type="button"
                            onClick={() => handleCancel()}
                            className="px-[20px] py-[10px] border-[.5px] border-[#CC400C] md:m-3 text-[12px] font-semibold text-[#CC400C] focus:bg-[#CC400C] focus:text-white rounded-lg hover:text-white hover:bg-[#CC400C] transition"
                          >
                            Cancel
                          </button>
                        ) : (
                          <> {item?.customGrade}</>
                        )}
                      </td>
                      <td
                        onClick={() => handleSelectRecord(item?._id)}
                        className="w-[80px] lg:w-[100px] shrink-0 text-right flex items-center justify-center flex-col text-primary"
                      >
                        <FaEye />
                        {selectedRecord === item?._id && (
                          <div
                            key={item?._id}
                            className="flex justify-center items-center my-2 mx-auto"
                          >
                            {isEditing ? (
                              ""
                            ) : (
                              <div className="flex justify-center items-center gap-4">
                                <button
                                  type="button"
                                  onClick={() => handleEditRecord()}
                                  className="text-primary"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRecord(item?._id)}
                                  className="text-red-400"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {isAdding && (
                    <tr className="flex items-center justify-center text-left gap-x-4 w-full text-[#535353] text-[12px] shrink-0 bg-transparent  p-1">
                      <td className="w-[120px] lg:w-[200px] shrink-0 bg-transparent">
                        <select
                          id="subject"
                          className="w-full text-center bg-transparent"
                          {...register("subjectId", { required: true })}
                        >
                          <option value="">Select Subject</option>
                          {subjects.map((subject) => (
                            <option
                              key={subject?._id}
                              value={subject?._id}
                              className="hover:bg-primary hover:text-white"
                            >
                              {subject?.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="w-[100px] lg:w-[150px] shrink-0 bg-transparent">
                        <input
                          type="number"
                          className="w-full text-center bg-transparent"
                          placeholder="Resumption-Test"
                          {...register("resumptionTest")}
                        />
                      </td>
                      <td className="w-[90px] lg:w-[120px] shrink-0 bg-transparent">
                        <input
                          type="number"
                          className="w-full text-center bg-transparent"
                          placeholder="Project"
                          {...register("project")}
                        />
                      </td>
                      <td className="w-[100px] lg:w-[150px] shrink-0 bg-transparent">
                        <input
                          type="number"
                          className="w-full text-center bg-transparent"
                          placeholder="MidTerm Test"
                          {...register("midTermTest")}
                        />
                      </td>
                      <td className="w-[80px] lg:w-[100px] shrink-0 bg-transparent">
                        <input
                          type="number"
                          className="w-full text-center bg-transparent"
                          placeholder="Exam"
                          {...register("examScore")}
                        />
                      </td>
                      <td className="w-[120px] lg:w-[150px] shrink-0 bg-transparent flex items-center justify-end">
                        <button
                          type="submit"
                          className="px-[20px] mr-2 py-[10px] border-[.5px] border-primary md:m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
                        >
                          {isSaving ? "Saving" : "Save"}
                        </button>
                        <input
                          hidden
                          value={selectedTerm}
                          type="text"
                          {...register("schoolTerm")}
                        />{" "}
                        <input
                          hidden
                          value={selectedYear}
                          type="text"
                          {...register("year")}
                        />
                        <input
                          hidden
                          value={id}
                          type="text"
                          {...register("studentId")}
                        />{" "}
                        <input
                          hidden
                          value={access?.classId}
                          type="text"
                          {...register("classId")}
                        />
                      </td>
                      <td className="w-[120px] lg:w-[150px] shrink-0 bg-transparent flex items-center justify-start">
                        <button
                          type="button"
                          onClick={() => handleCancel()}
                          className="px-[20px] py-[10px] border-[.5px] border-[#CC400C] md:m-3 text-[12px] font-semibold text-[#CC400C] focus:bg-[#CC400C] focus:text-white rounded-lg hover:text-white hover:bg-[#CC400C] transition"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </form>
          {studentRecord?.length !== 0 && (
            <div className="w-full">
              {record?.remarks !== null && (
                <div className="w-full mt-10 md:px-3 flex items-center justify-between">
                  <div className="text-hover md:text-xl md:font-bold">
                    Student Domains
                  </div>
                  <button
                    onClick={handleOpenDomainForm}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                  >
                    Add Domain
                  </button>
                </div>
              )}
              {record?.remarks?.pyschomotorDomain ||
              record?.remarks?.affectiveDomain ? (
                <TeachersDomain remark={record?.remarks} />
              ) : (
                record?.remarks !== null && (
                  <div className="p-[50px] w-full text-center md:text-xl font-thin">
                    No Domain Yet!
                  </div>
                )
              )}

              {isAddingDomain && (
                <AddDomain
                  handleCloseDomainForm={handleCloseDomainForm}
                  remarkId={record?.remarks?._id}
                />
              )}
            </div>
          )}
          {studentRecord?.length !== 0 && (
            <div className="w-full flex flex-col items-start justify-start mb-4">
              {record?.remarks === null ? (
                <p className="text-hover">
                  To add remarks and resumption date to students result
                  <span>
                    {" "}
                    <button
                      type="button"
                      onClick={handleOpenRemarkForm}
                      className="px-[20px] mr-2 py-[10px] border-[.5px] border-primary md:m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
                    >
                      Click here
                    </button>
                  </span>
                </p>
              ) : (
                <div className="w-full md:p-5 mt-[10px] ">
                  <div className="w-full flex justify-end item-center gap-1">
                    {isEditingRemark ? (
                      <button
                        type="submit"
                        onClick={() =>
                          handleSubmitUpdatedRemark(record?.remarks?._id)
                        }
                        className="px-[20px] py-[10px] border-[.5px] border-primary md:m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
                      >
                        {isUpdatingRemark ? "Updating..." : "Save"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleOpenUpdateRemark}
                        className="px-[20px] py-[10px] border-[.5px] border-primary md:m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
                      >
                        Update
                      </button>
                    )}
                    {isEditingRemark && (
                      <button
                        type="button"
                        onClick={handleCloseUpdateRemark}
                        className="px-[20px] py-[10px] border-[.5px] border-red-600 md:m-3 text-[12px] font-semibold text-red-600 focus:bg-red-600 focus:text-white rounded-lg hover:text-white hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  {/* <div className="w-full border-[.5px] shadow-sm border-primary rounded-md my-2 py-1 px-2 text-red-700">
                    Position:{" "}
                    {isEditingRemark ? (
                      <input
                        type="number"
                        onChange={(e) =>
                          setUpdatedRemarks({ position: e.target.value })
                        }
                        defaultValue={record?.remarks?.position}
                        className="px-3 py-2 shadow-none border-none ml-1 rounded focus:outline-none focus:border-none focus:shadow-none text-primary bg-[#F8F8F8]"
                      />
                    ) : (
                      <span className="text-primary ml-1">
                        {record?.remarks?.position}
                      </span>
                    )}
                  </div> */}
                  <div className="w-full border-[.5px] shadow-sm border-primary rounded-md my-2 py-1 px-2 text-red-700">
                    Remarks:{" "}
                    {isEditingRemark ? (
                      <input
                        type="text"
                        onChange={(e) =>
                          setUpdatedRemarks({ comments: e.target.value })
                        }
                        defaultValue={record?.remarks?.comments}
                        className="px-3 py-2 shadow-none border-none ml-1 rounded focus:outline-none focus:border-none focus:shadow-none text-primary bg-[#F8F8F8]"
                      />
                    ) : (
                      <span className="text-primary ml-1">
                        {record?.remarks?.comments}
                      </span>
                    )}
                  </div>
                  <div className="w-full border-[.5px] shadow-sm border-primary rounded-md my-2 py-1 px-2 text-red-700">
                    Resumption Date:{" "}
                    {isEditingRemark ? (
                      <input
                        type="date"
                        onChange={(e) =>
                          setUpdatedRemarks({ resumptionDate: e.target.value })
                        }
                        defaultValue={
                          record?.remarks?.resumptionDate?.split("T")[0]
                        }
                        className="px-3 py-2 shadow-none border-none ml-1 rounded focus:outline-none focus:border-none focus:shadow-none text-primary bg-[#F8F8F8]"
                      />
                    ) : (
                      <span className="text-primary ml-1">
                        {record?.remarks?.resumptionDate?.split("T")[0]}
                      </span>
                    )}
                  </div>
                </div>
              )}
              <p className="text-hover mt-[20px] mb-[30px]">
                Overall Total Scores:{" "}
                <span className="font-bold text-primary">
                  {record?.totalScore}
                </span>
              </p>
            </div>
          )}
          {isAddingRemark && (
            <div className="w-full md:w-[400px] mx-auto mt-[10px] mb-[20px]">
              <div className="w-full flex justify-end item-center mb-[-15px]">
                <button
                  type="button"
                  onClick={handleCloseRemarkForm}
                  className="px-[20px] mr-2 py-[10px] border-[.5px] border-red-600 md:m-3 text-[12px] font-semibold text-red-600 focus:bg-red-600 focus:text-white rounded-lg hover:text-white hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </div>
              <RemarkForm studentId={record?.data[0]?.studentId?._id} />{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamRecord;
