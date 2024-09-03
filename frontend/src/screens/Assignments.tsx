import React, { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { DataGrid, GridColumns } from "@material-ui/data-grid";
import PhoneOutlinedIcon from "@material-ui/icons/PhoneOutlined";
import MailOutlineOutlinedIcon from "@material-ui/icons/MailOutlineOutlined";
import { FormControlLabel, IconButton } from "@material-ui/core";
import AllAssignments from "../data/creative.json";
import Sidebar from "../users/admin/components/Sidebar";

interface ContactIconsProps {
  index: number;
  label?: string;
}

const ContactIcons: React.FC<ContactIconsProps> = ({ index }) => {
  return (
    <FormControlLabel
      label="Assignments"
      control={
        <IconButton color="secondary" aria-label="add an alarm">
          <PhoneOutlinedIcon
            style={{
              color: "#3351C2",
              background: "#CCD4F0",
              borderRadius: "100%",
              padding: "5px",
              margin: "0px 10px",
            }}
          />
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
      }
    />
  );
};

const columns: GridColumns = [
  {
    field: "name",
    headerName: "NAME",
    width: 180,
    renderCell: (params) => {
      return (
        <div className="flex items-center space-x-3">
          <img
            className="rounded-full w-9 h-9 object-cover"
            src={params.row.img}
            alt={params.row.name}
          />
          <p className="font-bold text-gray-700 pr-4">{params.row.name}</p>
        </div>
      );
    },
  },
  {
    field: "id",
    headerName: "ID",
    width: 120,
    renderCell: (params) => {
      return <p className="font-bold text-blue-700">{params.row.id}</p>;
    },
  },
  {
    field: "contact",
    headerName: "CONTACT",
    width: 160,
    renderCell: (params) => {
      return (
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ cursor: "pointer" }}
        >
          <ContactIcons index={params.row.id} />
        </div>
      );
    },
  },
  {
    field: "grade",
    headerName: "Grade",
    width: 160,
    renderCell: (params) => {
      return (
        <p className=" text-blue-800 bg-blue-100 rounded-full w-12 h-5 flex justify-center items-center">
          {params.row.grade}
        </p>
      );
    },
  },
  {
    field: "assignments",
    headerName: "Assignment",
    width: 160,
    renderCell: (params) => {
      return (
        <NavLink to={`/assignments/homework/${params.row.id}`}>
          <p className=" text-white bg-blue-800 rounded-full w-36 h-8 px-5 flex justify-center items-center">
            {params.row.assignment}
          </p>
        </NavLink>
      );
    },
  },
];

function Assignments() {
  const [assignmentData] = useState(AllAssignments.AssignmentsList);
  return (
    <div className="w-full grid grid-cols-6">
      <div className="col-span-1">
        <Sidebar />
      </div>
      <div className="col-span-5">
        <Wrapper>
          <section className="students__section px-12 pb-12 -ml-20 md:-ml-24 lg:-ml-32 xl:m-0 2xl:m-0">
            <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row  pt-12 pb-12">
              <h1 className="students__heading font-semibold text-xl md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl flex flex-grow pb-4">
                Assignments
              </h1>
            </div>

            <div className="grid grid-cols-1 bg-white rounded-xl shadow-xl p-8 box-border">
              <div
                className="data__table__students"
                style={{ height: 500, width: "100%" }}
              >
                <DataGrid
                  rows={assignmentData.map(
                    ({ id, name, image, grade, assignment }, index) => {
                      return {
                        id: id,
                        name: name,
                        img: image,
                        assignment: assignment,
                        grade: grade,
                      };
                    }
                  )}
                  columns={columns}
                  pageSize={6}
                  checkboxSelection
                  disableSelectionOnClick
                />
              </div>
            </div>
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
      color: #1f155e;
    }

    .new__students__button {
      background: #193aba;
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

export default Assignments;
