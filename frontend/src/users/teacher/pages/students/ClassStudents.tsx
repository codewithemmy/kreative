import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { FormControlLabel, IconButton } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColumns } from "@material-ui/data-grid";
import PhoneOutlinedIcon from "@material-ui/icons/PhoneOutlined";
import MailOutlineOutlinedIcon from "@material-ui/icons/MailOutlineOutlined";
import avatar from "../../../../assets/avartar.jpeg";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import TeacherSidebar from "../../components/TeacherSidebar";
import Header from "../../../../header/Header";
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
            aria-label="call"
          >
            <PhoneOutlinedIcon
              style={{
                color: "#3351C2",
                background: "#CCD4F0",
                borderRadius: "100%",
                padding: "5px",
                margin: "0px 5px",
              }}
            />
          </IconButton>
          <IconButton
            onClick={handleEmailClick}
            color="secondary"
            aria-label="email"
          >
            <MailOutlineOutlinedIcon
              style={{
                color: "#3351C2",
                background: "#CCD4F0",
                borderRadius: "100%",
                padding: "5px",
                margin: "0px 5px",
              }}
            />
          </IconButton>
        </>
      }
    />
  );
};

function ClassStudents() {
  const [studentList, setStudentList] = useState<any[]>([]);
  const [myClass, setMyClass] = useState<any>(null);
  const { access, selectedTerm, selectedYear } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  // const [record, setRecord] = useState<any[]>([]);
  const navigate = useNavigate();

  const navigateToDetails = (id: string) => {
    navigate(`${id}`, {
      state: { studentList: studentList, classname: myClass?.name },
    });
  };

  const navigateToRecords = (id: string) => {
    navigate(`/students/record/${id}`, {
      state: { studentList: studentList },
    });
  };

  const handleGetAllRecords = async () => {
    try {
      const response = await ApiAuth.get(
        `/class?_id=${access?.classId}&students=records&schoolTerm=${selectedTerm}`,
        {
          headers: {
            Authorization: `Bearer ${access?.userToken}`,
          },
        }
      );
      setStudentList(response?.data.data);
      // setRecord(response.data);
    } catch (error) {
      // handle error
    }
  };

  const getClassDetails = async () => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.get(`/class?_id=${access?.classId}`, {
        headers: {
          Authorization: "Bearer " + access?.userToken,
        },
      });
      setIsLoading(false);
      setMyClass(response.data.data?.[0]);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllRecords();
    getClassDetails();
  }, []);

  useEffect(() => {
    handleGetAllRecords();
  }, [selectedTerm]);

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
            <div className="flex items-center justify-center">
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
      width: 250,
      renderCell: (params) => {
        return (
          <p className="font-bold text-gray-700 pr-6">{params.row?.name}</p>
        );
      },
    },
    {
      field: "studentId",
      headerName: "ID",
      width: 120,
      renderCell: (params) => {
        return (
          <p className="font-bold text-gray-700 pr-6">{params.row?.validId}</p>
        );
      },
    },
    {
      field: "position",
      headerName: "POSITION",
      width: 160,
      renderCell: (params) => {
        return (
          <p className="text-hover font-semibold rounded-full w-12 h-5 flex justify-center items-center">
            {params.row.position}
          </p>
        );
      },
    },
    {
      field: "termTotalScore",
      headerName: "TOTAL SCORE",
      width: 180,
      renderCell: (params) => {
        return <p className="font-bold text-gray-700">{params.row?.score}</p>;
      },
    },
    {
      field: "record",
      headerName: "RECORD",
      width: 120,
      renderCell: (params) => {
        return (
          <button onClick={() => navigateToRecords(params.row?.id)}>
            <p className="font-bold text-hover hover:text-primary pr-4 text-xs">
              Record
            </p>
          </button>
        );
      },
    },
    {
      field: "contact",
      headerName: "CONTACT",
      width: 140,
      renderCell: (params) => {
        return (
          <div style={{ cursor: "pointer" }}>
            <ContactIcons
              index={params.row?.id}
              phone={params.row?.phone}
              email={params.row?.email}
            />
          </div>
        );
      },
    },
  ];

  const sortedStudents = studentList
    .sort((a, b) => b.termTotalScore - a.termTotalScore)
    .map((student, index) => ({
      ...student,
      position: index + 1,
    }));

  return (
    <div className="w-full grid grid-cols-6">
      <div className="col-span-1">
        <TeacherSidebar />
      </div>
      <div className="col-span-5 mt-24 lg:mt-0">
        <Header />
        <Wrapper>
          <section className="students__section px-3 md:px-6 lg:px-12 pb-12 -ml-16 md:-ml-24 lg:-ml-32 xl:m-0 2xl:m-0">
            <div className="flex justify-between items-center p-2 md:p-8 lg:p-12 mt-3">
              <h1 className="text-primary font-semibold text-xl md:text-2xl flex">
                {myClass?.name}
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
            ) : !studentList || studentList?.length === 0 ? (
              <div className="mx-auto text-center my-5 w-full font-serif font-thin text-lg md:text-xl">
                No student added yet
              </div>
            ) : (
              <div className="grid grid-cols-1 bg-white rounded-xl shadow-xl md:p-3 lg:p-8 box-border">
                <div
                  className="data__table__students"
                  style={{ height: 500, width: "100%" }}
                >
                  <DataGrid
                    rows={sortedStudents?.map(
                      ({
                        _id,
                        name,
                        validId,
                        profileImage,
                        phone,
                        email,
                        termTotalScore,
                        position,
                      }) => {
                        return {
                          id: _id,
                          validId: validId,
                          name: name,
                          img: profileImage,
                          score: termTotalScore,
                          position: position,
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

export default ClassStudents;
