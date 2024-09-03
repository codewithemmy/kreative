import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Pagination from "../../../../utilities/Pagination";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import AdminHeader from "../../../../header/AdminHeader";
import Spinner from "../../../../utilities/Spinner";
import ClassItem from "../../components/classes/ClassItem";
import ClassForm from "../../components/classes/ClassForm";

function Myclass() {
  const [classList, setClassList] = useState<any[]>([]);
  const { adminAccess, adminDetails, sent, loadAdminDetails } =
    useContext(Context);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [classPerPage] = useState(9);
  const navigate = useNavigate();
  const [filteredClass, setFilteredClass] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const indexOfLastClass = currentPage * classPerPage;
  const indexOfFirstClass = indexOfLastClass - classPerPage;
  const currentClass = filteredClass?.slice(
    indexOfFirstClass,
    indexOfLastClass
  );

  const handleGetClass = async () => {
    if (!adminDetails) {
      loadAdminDetails();
      return
    }
    setIsLoading(true);
    try {
      const response =
        adminAccess?.accountType === "admin"
          ? await ApiAuth.get(
              `/class?branchId=${adminDetails?.[0]?.branchId}`,
              {
                headers: {
                  Authorization: "Bearer " + adminAccess?.userToken,
                },
              }
            )
          : await ApiAuth.get(`/class`, {
              headers: {
                Authorization: "Bearer " + adminAccess?.userToken,
              },
            });
      setIsLoading(false);
      setClassList(response?.data.data);
      setFilteredClass(response?.data.data);
    } catch (error) {
      setIsLoading(false);
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
  }, [sent]);

  const paginate = (pageNumber: any) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(filteredClass.length / classPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const filterClass = (category: string) => {
    const filtering = classList.filter((classItem) => {
      return classItem.level === category;
    });
    setFilteredClass(filtering);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const navigateToDetails = (id: string) => {
    navigate(`${id}`, { state: { classList: classList } });
  };

  return (
    <div className="w-full grid grid-cols-6">
      <div className="col-span-1">
        <Sidebar />
      </div>
      <div className="col-span-5 mt-24 lg:mt-0">
        <AdminHeader />
        <Wrapper>
          <section className="students__section px-3 md:px-6 lg:px-12 pb-12 -ml-16 md:-ml-24 lg:-ml-32 xl:m-0 2xl:m-0">
            <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row  px-4 pt-12 pb-12">
              <h1 className="font-semibold text-xl md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl flex flex-grow pb-4">
                Classes
              </h1>
              <button
                onClick={handleOpenModal}
                className="bg-primary hover:bg-hover text-white text-[12px] p-2 rounded-[30px] w-[150px]"
              >
                Create New Class
              </button>
            </div>

            <div className="">
              <button
                className="px-[20px] py-[10px] border-[.5px] border-primary m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
                onClick={() => {
                  setFilteredClass(classList);
                }}
              >
                All Classes
              </button>
              <button
                className="px-[20px] py-[10px] border-[.5px] border-primary m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
                onClick={() => {
                  filterClass("Nursery");
                }}
              >
                Nursery
              </button>
              <button
                className="px-[20px] py-[10px] border-[.5px] border-primary m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
                onClick={() => {
                  filterClass("Primary");
                }}
              >
                Primary
              </button>
              <button
                className="px-[20px] py-[10px] border-[.5px] border-primary m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
                onClick={() => {
                  filterClass("Secondary");
                }}
              >
                Secondary
              </button>
            </div>
            {isLoading ? (
              <div className="w-full flex justify-center items-center">
                <Spinner />
              </div>
            ) : currentClass.length === 0 ? (
              <div className="mx-auto text-center my-5 w-full font-serif font-extralight text-lg md:text-xl">
                No Class Added Yet
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-12">
                {currentClass.map((classItem, index) => (
                  <button
                    key={index}
                    onClick={() => navigateToDetails(classItem?._id)}
                  >
                    <ClassItem {...classItem} />
                  </button>
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              noPerPage={classPerPage}
              total={filteredClass.length}
              paginate={paginate}
              pageName=""
            />
            {showModal && <ClassForm onClose={handleCloseModal} />}
          </section>
        </Wrapper>
      </div>
    </div>
  );
}

const Wrapper = styled.section`
  .my__classes__section {
    background: #f1f3f9;

    .my__classes__heading {
      color: #3944bc;
    }

    .my__classes__category__tabs {
      padding: 10px 28px;
      background: #f1f3f9;
      color: #1f155e;
      font-size: 13px;
      font-weight: 500;
      border: 2px solid #ddd;
      margin: 5px 5px;
    }
    .my__classes__category__tabs:focus {
      background: #ffffff;
      color: #193aba;
      border-bottom: 2px solid #193aba;
    }
    .MuiDataGrid-window::-webkit-scrollbar {
      display: none;
    }
  }
`;

export default Myclass;
