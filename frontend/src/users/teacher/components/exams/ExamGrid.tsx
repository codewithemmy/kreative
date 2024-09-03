import React, { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { DataGrid, GridColumns } from "@material-ui/data-grid";
import PhoneOutlinedIcon from "@material-ui/icons/PhoneOutlined";
import MailOutlineOutlinedIcon from "@material-ui/icons/MailOutlineOutlined";
import { FormControlLabel, IconButton } from "@material-ui/core";
import ExamList from "../../../../data/creative.json";

interface ContactIconsProps {
  index: number;
  label?: string;
}

const ContactIcons: React.FC<ContactIconsProps> = ({ index }) => {
  return (
    <FormControlLabel
      label="Students"
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
        <NavLink to={`/students/record/${params.row.id}`}>
          <div className="flex items-center space-x-3">
            <img
              className="rounded-full w-9 h-9 object-cover"
              src={params.row.img}
              alt={params.row.name}
            />
            <p className="font-bold text-gray-700 pr-4">{params.row.name}</p>
          </div>
        </NavLink>
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
    field: "score",
    headerName: "Score",
    width: 180,
    renderCell: (params) => {
      return <p className="font-bold text-gray-700">{params.row.score}</p>;
    },
  },
  {
    field: "passed",
    headerName: "passed",
    width: 180,
    renderCell: (params) => {
      return <p className="font-bold text-gray-700">{params.row.passed}</p>;
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
];

function ExamGrid() {
  const [examsdata] = useState(ExamList.ExamGridList);
  return (
    <div>
      <Wrapper>
        <section className="students__section">
          <div className="grid grid-cols-1 bg-white rounded-xl shadow-xl box-border">
            <div
              className="data__table__students"
              style={{ height: 370, width: "100%" }}
            >
              <DataGrid
                rows={examsdata?.map(
                  ({ id, name, image, score, passed, grade }, index) => {
                    return {
                      id: id,
                      name: name,
                      img: image,
                      score: score,
                      passed: passed,
                      grade: grade,
                    };
                  }
                )}
                columns={columns}
                pageSize={5}
                checkboxSelection
                disableSelectionOnClick
              />
            </div>
          </div>
        </section>
      </Wrapper>
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

export default ExamGrid;
