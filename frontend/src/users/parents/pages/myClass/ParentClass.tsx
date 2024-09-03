import React, { useContext, useEffect, useState } from "react";
import Header from "../../../../header/Header";
import { FaEdit, FaPlus } from "react-icons/fa";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import placeholder from "../../../../assets/placeholder.png";
import { task, announcement } from "../../../../data/creative.json";
import imager from "../../../../assets/useroverview.png";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../../context/Context";
import { Button } from "@material-tailwind/react";
import ApiAuth from "../../../../api/ApiAuth";
import Spinner from "../../../../utilities/Spinner";
import ParentSidebar from "../../components/ParentSidebar";
import FellowStudents from "../../components/myClass/FellowStudents";

const ParentClass: React.FC = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classDetails, setClassDetails] = useState<any | null>(null);
  const navigate = useNavigate();
  const { access, userDetails, loadUserDetails } = useContext(Context);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const [editModal, setEditModal] = useState<boolean>(false);

  const getClassDetails = async () => {
    if (!userDetails) {
      await loadUserDetails();
      getClassDetails();
      return;
    }
    setIsLoading(true);
    try {
      const response = await ApiAuth.get(`/class?_id=${access?.classId}`, {
        headers: {
          Authorization: "Bearer " + access?.userToken,
        },
      });
      setIsLoading(false);
      setClassDetails(response.data.data);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleGetSubjects = async () => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.get(
        `/subject?classId=${userDetails?.[0]?.intendedClass}`,
        {
          headers: {
            Authorization: "Bearer " + access?.userToken,
          },
        }
      );
      setIsLoading(false);
      console.log(response.data.data);
      setSubjects(response?.data.data);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetSubjects();
    getClassDetails();
  }, []);

  const navigateToClassStudents = () => {
    navigate(`/teacher/students`, {});
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const saveChanges = () => {
    closeModal();
  };

  return (
    <div className="md:flex min-h-full bg-[#F8F8F8] lg:px-4 lg:relative">
      <ParentSidebar />
      <div className="w-screen lg:w-[85%] lg:absolute lg:right-0 mt-24 lg:mt-0">
        <Header />
        {isLoading ? (
          <div className="w-full flex justify-center items-center h-[400px]">
            <Spinner />
          </div>
        ) : (
          <section className="w-full px-4 md:px-12 pb-12">
            <div className="flex justify-between items-center p-2 md:p-8 lg:p-12 mt-3">
              <h1 className="text-primary font-semibold text-xl md:text-2xl flex">
                {classDetails?.[0]?.name}
              </h1>
            </div>

            <div className="w-full md:w-[90%] lg:w-[80%] bg-white rounded-xl shadow-lg box-border p-2 mx-auto md:p-8">
              <div className="w-full mx-auto md:w-[80%] lg:w-[60%] h-[300px] md:h-[400px] rounded-lg mb-8 overflow-hidden">
                <img
                  className="w-full h-full"
                  src={classDetails?.[0]?.image || placeholder}
                  alt={classDetails?.[0]?.name}
                />
              </div>

              <div className="flex gap-4 justify-between items-center py-3 w-full md:w-[80%] mx-auto lg:w-[50%]">
                <h1 className="text-gray-500 font-semibold text-lg md:text-xl lg:text-2xl">
                  {classDetails?.[0]?.name}
                </h1>
                <span className="md:text-lg text-primary">
                  {classDetails?.[0]?.tag}
                </span>
              </div>

              <div className="mt-4 text-sm font-light text-hover text-justify">
                {classDetails?.[0]?.address}
              </div>
            </div>

            <div className="mt-8 md:px-16">
              <div className="text-primary font-semibold md:text-xl p-1">
                Class Subjects
              </div>
              <div className="flex flex-wrap gap-4 mt-3">
                {subjects?.map((subject) => (
                  <div key={subject?._id} className="relative">
                    <button className="border border-primary rounded-md py-1 px-2 text-primary">
                      {subject?.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 p-4">
          <div>
            <h1 className="font-semibold text-lg pb-4">Task</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {task.map((tasks) => (
                <div
                  className="bg-white shadow-xl rounded-lg p-4"
                  key={tasks.id}
                >
                  <h2>{tasks.sub} Assignment</h2>
                  <p>
                    Due:
                    <span className="rounded-full text-red-400 p-1">
                      {tasks.due}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h1 className="font-semibold text-lg pb-4">Notice</h1>
            <div className="flex flex-col gap-4">
              {announcement.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white shadow-xl rounded-lg p-4"
                >
                  <p>{notice.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentClass;
