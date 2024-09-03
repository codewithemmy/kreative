import React, { useState } from "react";
import EditClassForm from "./EditClassForm";
import placeholder from "../../../../assets/placeholder.png";
import styled from "styled-components";
import { FaUsers } from "react-icons/fa";

interface ClassItemProps {
  _id: string;
  image: string;
  tag: string;
  name: string;
  studentId: any[];
  teacherId: any[];
  level: string;
}

const ClassItem: React.FC<ClassItemProps> = ({
  _id,
  image,
  name,
  tag,
  studentId,
  teacherId,
}) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const truncatedName = name.length > 10 ? name.substring(0, 10) + "..." : name;

  const truncatedTag =
    tag.length > 15 ? "..." + tag.substring(tag.length - 15) : tag;

  return (
    <Wrapper>
      <div className="course__card bg-white rounded-xl shadow-lg box-border p-4 m-1 md:m-0">
        <div className="my__courses__image__wrapper rounded-xl cursor-pointer">
          <img
            className="transition duration-700 ease-in-out transform w-full text-sm object-contain hover:scale-125"
            src={image || placeholder}
            alt={truncatedName}
            height="140px"
          />
        </div>

        <div className="">
          <div className="flex flex-row justify-between items-center pt-4">
            <h1 className="text-gray-500 font-semibold md:text-lg">
              {truncatedName}
            </h1>
            <span className="text-hover text-sm flex items-center">
              ({truncatedTag})
            </span>
          </div>
          <div className="flex flex-row justify-between px-1 items-center py-3">
            <h3 className="flex items-center text-sm my__courses__students__number ">
              {studentId?.length}{" "}
              <span className="pl-2 text-sm text-[#fb7d5b]">
                {studentId?.length > 1 ? "Students" : "Student"}
              </span>
            </h3>
            {teacherId?.[0]?.name && (
              <div className="text-hover text-sm">
                Teacher:{" "}{teacherId?.[0]?.name.split(" ")[0]}
              </div>
            )}
          </div>
        </div>
        {openModal && <EditClassForm onClose={handleCloseModal} id={_id} />}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .my__courses__image__wrapper {
    height: 150px;
    overflow: hidden;
  }
  .my__courses__students__number {
    color: #fb7d5b;
  }

  @media screen and (max-width: 320px) {
    .course__card {
      width: 280px;
    }

    .course__card__time {
      font-size: 14px;
    }
  }
`;

export default ClassItem;
