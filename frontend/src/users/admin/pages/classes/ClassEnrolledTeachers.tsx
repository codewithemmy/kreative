import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColumns } from "@material-ui/data-grid";
import PhoneOutlinedIcon from "@material-ui/icons/PhoneOutlined";
import MailOutlineOutlinedIcon from "@material-ui/icons/MailOutlineOutlined";
import { FormControlLabel, IconButton } from "@material-ui/core";
import Sidebar from "../../components/Sidebar";
import avatar from "../../../../assets/avartar.jpeg";
import AdminHeader from "../../../../header/AdminHeader";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import { FaEdit, FaTrash } from "react-icons/fa";
import CustomModal from "../../../../utilities/CustomModal";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import Spinner from "../../../../utilities/Spinner";

interface ContactIconsProps {
  index?: number;
  phone: string;
  email: string;
  label?: string;
}

const ContactIcons: React.FC<ContactIconsProps> = ({ phone, email, index }) => {
  const handlePhoneClick = () => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${email}`;
  };
  return (
    <FormControlLabel
      label=""
      control={
        <>
          <IconButton
            onClick={handlePhoneClick}
            color="secondary"
            aria-label="add an alarm"
          >
            <PhoneOutlinedIcon
              style={{
                color: "#3351C2",
                background: "#CCD4F0",
                borderRadius: "100%",
                padding: "5px",
                margin: "0px 10px",
              }}
            />
          </IconButton>
          <IconButton
            onClick={handleEmailClick}
            color="secondary"
            aria-label="add an alarm"
          >
            <MailOutlineOutlinedIcon
              style={{
                color: "#3351C2",
                background: "#CCD4F0",
                borderRadius: "100%",
                padding: "5px",
                margin: "0px 10px",
              }}
            />
          </IconButton>
        </>
      }
    />
  );
};

function ClassEnrolledTeachers() {
  const [teachersList, setTeachersList] = useState<any[]>([]);
  const [myClass, setMyClass] = useState<any[]>([]);
  const { adminAccess, sent, setSent, adminDetails, classId } =
    useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [id, setId] = useState<string | "">("");
  const navigate = useNavigate();
  const [isTrue, setIsTrue] = useState(false);

  const navigateToDetails = (id: string) => {
    navigate(`/admin/teachers/${id}`, {
      state: {
        teachersList: teachersList,
        classname: myClass?.[0]?.name,
        isTrue: isTrue,
      },
    });
  };

  const navigateToEdit = (id: string) => {
    setIsTrue(true);
    setId(id);
    setIsLoading(true);
    if (isTrue == true) {
      setIsLoading(false);
      navigate(`/admin/teachers/${id}`, {
        state: {
          teachersList: teachersList,
          classname: myClass?.[0]?.name,
          isTrue: isTrue,
        },
      });
    }
  };

  useEffect(() => {
    navigateToEdit(id);
  }, [isTrue]);

  const handleGetTeachers = async () => {
    setIsLoading(true);
    try {
      const response =
        adminAccess?.accountType === "admin"
          ? await ApiAuth.get(
              `/user?branchId=${adminDetails?.[0]?.branchId}&intendedClass=${classId}`,
              {
                headers: {
                  Authorization: "Bearer " + adminAccess?.userToken,
                },
              }
            )
          : await ApiAuth.get(`/user?intendedClass=${classId}`, {
              headers: {
                Authorization: "Bearer " + adminAccess?.userToken,
              },
            });
      setIsLoading(false);
      setTeachersList(response?.data.data.data);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleGetClass = async () => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.get(`/class?_id=${classId}`, {
        headers: {
          Authorization: "Bearer " + adminAccess?.userToken,
        },
      });
      setIsLoading(false);
      setMyClass(response?.data.data);
    } catch (error) {
      setIsLoading(false);
      const errorMessage = "Error fetching classes";
      console.log(errorMessage);
    }
  };

  const handleDelete = async () => {
    handleCloseDelete();
    setIsLoading(true);
    try {
      const response = await ApiAuth.delete(`/user/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminAccess?.userToken}`,
        },
      });
      setSent(!sent);
      setIsLoading(false);
      successNotifier("Account deleted successfully!");
    } catch (err) {
      setIsLoading(false);
      errorNotifier(
        "Account could not delete, please contact the administrator"
      );
    }
  };

  useEffect(() => {
    setIsTrue(false);
    handleGetTeachers();
    handleGetClass();
  }, []);

  useEffect(() => {
    setIsTrue(false);
    handleGetTeachers();
    handleGetClass();
  }, [sent]);

  const handleOpenDelete = (id: string) => {
    setId(id);
    setDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setDeleteModal(false);
  };

  const goBack = () => {
    window.history.back();
  };

  const columns: GridColumns = [
    {
      field: "IMG",
      headerName: "IMG",
      width: 80,
      renderCell: (params) => {
        return (
          <button onClick={() => navigateToDetails(params.row?.id)}>
            <div className="flex items-center space-x-3">
              <img
                className="rounded-full w-[40px] h-[40px] "
                src={params.row?.img || avatar}
                alt={params.row?.name}
              />
            </div>
          </button>
        );
      },
    },
    {
      field: "name",
      headerName: "NAME",
      width: 180,
      renderCell: (params) => {
        return (
          <p className="font-bold text-gray-700 pr-4">{params.row?.name}</p>
        );
      },
    },

    {
      field: "subject",
      headerName: "SUBJECT",
      width: 300,
      renderCell: (params) => {
        return <p className="font-bold text-gray-700">{params.row?.subject}</p>;
      },
    },
    {
      field: "class",
      headerName: "CLASS",
      width: 200,
      renderCell: (params) => {
        return <p className="font-bold text-gray-700">{myClass?.[0]?.name}</p>;
      },
    },
    {
      field: "contact",
      headerName: "CONTACT",
      width: 140,
      renderCell: (params) => {
        return (
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
          >
            <ContactIcons
              index={params.row?.id}
              phone={params.row?.phone}
              email={params.row?.email}
            />
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      width: 140,
      renderCell: (params) => (
        <div>
          <IconButton
            onClick={() => navigateToEdit(params.row?.id)}
            color="primary"
          >
            <FaEdit className="text-hover w-3 h-3 mr-4" />
          </IconButton>
          <IconButton
            onClick={() => handleOpenDelete(params.row.id)}
            className="text-red-500"
          >
            <FaTrash className="text-red-500 w-3 h-3" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full grid grid-cols-6">
      <div className="col-span-1">
        <Sidebar />
      </div>
      <div className="col-span-5 mt-24 lg:mt-0">
        <AdminHeader />
        <Wrapper>
          <section className="students__section px-3 md:px-6 lg:px-12 pb-12 -ml-16 md:-ml-24 lg:-ml-32 xl:m-0 2xl:m-0">
            <div className="flex justify-between items-center p-2 md:p-8 lg:p-12 mt-3">
              <h1 className="text-primary font-semibold text-xl md:text-2xl flex">
                {myClass?.[0]?.name}
              </h1>
              <button
                className="px-[20px] py-[10px] border-[.5px] border-primary md:m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
                onClick={goBack}
              >
                Back
              </button>
            </div>
            {isLoading ? (
              <Spinner />
            ) : !teachersList || teachersList?.length === 0 ? (
              <div className="mx-auto text-center my-5 w-full font-serif font-thin text-lg md:text-xl">
                No teacher added yet
              </div>
            ) : (
              <div className="grid grid-cols-1 bg-white rounded-xl shadow-xl md:p-3 lg:p-8 box-border">
                <div
                  className="data__table__students"
                  style={{ height: 500, width: "100%" }}
                >
                  <DataGrid
                    rows={teachersList?.map(
                      (
                        {
                          _id,
                          name,
                          profileImage,
                          subject,
                          intendedClass,
                          phone,
                          email,
                        },
                        index
                      ) => {
                        return {
                          id: _id,
                          name: name,
                          img: profileImage,
                          subject: subject,
                          intendedClass,
                          phone: phone,
                          email: email,
                        };
                      }
                    )}
                    columns={columns}
                    rowsPerPageOptions={[7, 10]}
                    pageSize={7}
                    checkboxSelection
                    disableSelectionOnClick
                  />
                </div>
              </div>
            )}
            {deleteModal && (
              <CustomModal
                id={id}
                action={"delete"}
                type={"Account"}
                onConfirm={handleDelete}
                onCancel={handleCloseDelete}
              />
            )}
          </section>
        </Wrapper>
      </div>
    </div>
  );
}
const Wrapper = styled.section`
  .students__section {
    background: #f1f3f9;

    .students__heading {
      color: #3944bc;
    }

    .new__students__button {
      background: #6c1eeb;
      color: white;
      text-transform: capitalize !important;
      border-radius: 50px !important;
      padding: 12px 24px;
      font-weight: bold;
      font-size: 15px;
    }
    .data__table__students::-webkit-scrollbar {
      display: none;
    }
  }
`;

export default ClassEnrolledTeachers;
