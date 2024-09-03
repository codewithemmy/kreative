import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import imager from "../../../../assets/useroverview.png";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import CustomModal from "../../../../utilities/CustomModal";
import placeholder from "../../../../assets/placeholder.png";
import CustomButton from "../../../../customBtn";
import ApiAuth from "../../../../api/ApiAuth";
import { Context } from "../../../../context/Context";
import EditClassForm from "../../components/classes/EditClassForm";
import SubjectForm from "../../components/classes/SubjectForm";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";

const ClassDetails: React.FC = () => {
  const location = useLocation();
  const [classDetails, setClassDetails] = useState<any | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminAccess, sent, setSent, setClassId } = useContext(Context);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [nem, setNem] = useState<string | "">("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | "">("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const [editModal, setEditModal] = useState<boolean>(false);
  const [classModal, setClassModal] = useState<boolean>(false);

  const onSubmit = async (id: string) => {
    setIsLoading(true);
    const filteredData = Object.fromEntries(
      Object.entries(nem).filter(([_, value]) => value !== "")
    );
    try {
      const response = await ApiAuth.patch(`/subject/${id}`, filteredData, {
        headers: {
          Authorization: `Bearer ${adminAccess?.userToken}`,
        },
      });
      setSent(!sent);
      setIsEditing(false);
      setSelectedSubject("");
      setIsLoading(false);
      successNotifier("Subject updated successfully!");
    } catch (error: any) {
      setIsLoading(false);
      errorNotifier(error?.response.data.message);
    }
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

  const handleEditSubject = (id: string) => {
    setIsEditing(true);
  };

  const handleSelectSubject = (id: string) => {
    if (selectedSubject === "") {
      setSelectedSubject(id);
    } else {
      setSelectedSubject("");
    }
  };

  const handleClassModal = () => {
    setClassModal(true);
  };

  const closeClassModal = () => {
    setClassModal(false);
  };

  const navigateToClassStudents = (id: string) => {
    setClassId(id);
    navigate(`/admin/classes/class-students`, {
      state: { classDetails: classDetails },
    });
  };

  const navigateToClassTeachers = (id: string) => {
    setClassId(id);
    navigate(`/admin/classes/class-teachers`, {
      state: { classDetails: classDetails },
    });
  };

  const handleGetSubjects = async () => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.get(`/subject?classId=${id}`, {
        headers: {
          Authorization: "Bearer " + adminAccess?.userToken,
        },
      });
      setIsLoading(false);
      setSubjects(response?.data.data);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetSubjects();
  }, []);

  useEffect(() => {
    handleGetSubjects();
  }, [sent]);

  const handleDelete = async () => {
    closeEndModal();
    setIsDeleting(true);
    try {
      const response = await ApiAuth.delete(`/class/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminAccess?.userToken}`,
        },
      });
      setIsDeleting(false);
      successNotifier("Class deleted successfully!");
      navigate("/admin/classes");
    } catch (err) {
      errorNotifier("Class could not delete, please contact the administrator");
    }
    setIsDeleting(false);
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      const response = await ApiAuth.delete(`/subject/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminAccess?.userToken}`,
        },
      });
      setSent(!sent);
      setIsEditing(false);
      setSelectedSubject("");
      successNotifier("Subject deleted successfully!");
    } catch (err: any) {
      errorNotifier(err?.response.data.message);
    }
  };

  useEffect(() => {
    if (!location.state.classList || !Array.isArray(location.state.classList)) {
      return;
    }
    if (id === undefined || id === null) {
      return;
    }
    const myClass = location.state?.classList.find(
      (item: any) => item?._id === id
    );

    setClassDetails(myClass);
  }, [id, location.state]);

  const goBack = () => {
    window.history.back();
  };

  return (
    <section className="w-full px-4 md:px-12 pb-12">
      <div className="flex justify-between items-center p-2 md:p-8 lg:p-12 mt-3">
        <h1 className="text-primary font-semibold text-xl md:text-2xl flex">
          Class Details
        </h1>
        <button
          className="px-[20px] py-[10px] border-[.5px] border-primary md:m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
          onClick={goBack}
        >
          Back
        </button>
      </div>

      <div className="w-full md:w-[90%] lg:w-[80%] bg-white rounded-xl shadow-lg box-border p-2 mx-auto md:p-8">
        <div className="w-full mx-auto md:w-[80%] lg:w-[60%] h-[300px] md:h-[400px] rounded-lg mb-8 overflow-hidden">
          <img
            className="w-full h-full"
            src={classDetails?.image || placeholder}
            alt={classDetails?.name}
          />
        </div>

        <div className="flex gap-4 justify-between items-center py-3 w-full md:w-[80%] mx-auto lg:w-[50%]">
          <h1 className="text-gray-500 font-semibold text-lg md:text-xl lg:text-2xl">
            {classDetails?.name}
          </h1>
          <span className="md:text-lg text-primary">{classDetails?.tag}</span>
        </div>

        <div className="mt-4 text-sm font-light text-hover text-justify">
          {classDetails?.address}
        </div>

        <div className="flex flex-col items-center mt-4">
          <button
            onClick={() => navigateToClassStudents(classDetails._id)}
            className="flex flex-row items-center"
          >
            <div className="flex">
              <img className="w-8 h-8 rounded-full" src={imager} alt="" />
              <img className="w-8 h-8 rounded-full" src={imager} alt="" />
              <img className="w-8 h-8 rounded-full" src={imager} alt="" />
              <img className="w-8 h-8 rounded-full" src={imager} alt="" />
              <h3 className="text-lg pl-8">
                {classDetails?.studentId?.length} Students
              </h3>
            </div>
          </button>

          {classDetails?.teacherId?.length > 0 && (
            <button
              onClick={() => navigateToClassTeachers(classDetails._id)}
              className="flex flex-row items-center"
            >
              <div className="text-left mt-4">
                Teacher: {classDetails?.teacherId?.[0]?.name}
                {classDetails?.teacherId?.[1]?.name}
                {classDetails?.teacherId?.[2]?.name}
                {classDetails?.teacherId?.[3]?.name}
              </div>{" "}
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 md:px-16">
        <div className="flex justify-between items-center">
          <h3 className="my-4 text-gray-700 text-lg font-bold">
            Class Subjects
          </h3>
          <button
            onClick={handleClassModal}
            className="px-[20px] py-[10px] border-[.5px] border-primary my-4 md:my-6 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
          >
            Add Subject
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          {subjects?.map((subject) => (
            <div key={subject?._id} className="relative">
              {selectedSubject === subject._id && isEditing ? (
                <input
                  type="text"
                  onChange={(e) => setNem(e.target.value)}
                  defaultValue={subject?.name}
                  className="px-3 py-2 border border-primary rounded focus:outline-none focus:border-primary bg-[#F8F8F8]"
                />
              ) : (
                <button
                  onClick={() => handleSelectSubject(subject?._id)}
                  className="border border-primary rounded-md py-1 px-2 text-primary"
                >
                  {subject?.name}
                </button>
              )}
              {selectedSubject === subject._id && (
                <div className="flex gap-3 justify-center items-center my-1 mx-auto">
                  {isEditing ? (
                    <button
                      onClick={() => onSubmit(subject._id)}
                      className="text-primary"
                    >
                      <FaSave />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditSubject(subject._id)}
                      className="text-primary"
                    >
                      <FaEdit />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteSubject(subject._id)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8">
          <button
            onClick={handleEditModal}
            className="px-[20px] py-[10px] border-[.5px] border-primary my-4 md:my-6 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
          >
            Edit Class
          </button>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between my-2 md:my-4">
          <CustomButton
            type="button"
            onClick={handleOpenModal}
            text={isDeleting ? "Deleting..." : "Delete Class"}
            bgColor="red"
            hover="red"
          />
          {showModal && (
            <CustomModal
              id={id}
              action={"delete"}
              type={"Class"}
              onConfirm={handleDelete}
              onCancel={closeEndModal}
            />
          )}
          <Link to="/admin/classes">
            <button className="px-[20px] py-[10px] border-[.5px] border-primary text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition mb-6 md:mb-0">
              Close
            </button>
          </Link>
        </div>
      </div>
      {editModal && <EditClassForm id={id} onClose={closeEditModal} />}
      {classModal && <SubjectForm id={id} onClose={closeEditModal} />}
    </section>
  );
};

export default ClassDetails;
