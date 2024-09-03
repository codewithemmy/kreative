import React, { useState } from "react";
import placeholder from "../../../../assets/placeholder.png";
import EditClassForm from "../classes/EditClassForm";
import styled from "styled-components";
import { FaLocationArrow } from "react-icons/fa";

interface BranchItemProps {
  _id: string;
  branchName: string;
  email: string;
  location: string;
  address: string;
  image: string;
  description: string;
}

const BranchItem: React.FC<BranchItemProps> = ({
  _id,
  image,
  branchName,
  location,
  address,
}) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const truncatedBranchName =
    branchName.length > 18 ? branchName.substring(0, 18) + "..." : branchName;

  const truncatedLocation =
    location.length > 6
      ? "..." + location.substring(location.length - 6)
      : location;

  return (
    <Wrapper>
      <div className="course__card bg-white rounded-xl shadow-lg box-border p-4 m-1 md:m-0">
        <div className="my__courses__image__wrapper rounded-xl cursor-pointer">
          <img
            className="transition duration-700 ease-in-out transform w-full text-sm object-contain hover:scale-125"
            src={image || placeholder}
            alt={truncatedBranchName}
            height="150px"
          />
        </div>

        <div className="">
          <div className=" flex flex-row justify-between items-center pt-4">
            <h1 className="course__card__titletext-gray-500 font-semibold text-lg">
              {truncatedBranchName}
            </h1>
            <span className="text-hover text-sm flex items-center">
              <FaLocationArrow className="w-3 h-4 mr-2" />({truncatedLocation})
            </span>
          </div>
          <div className="flex flex-row justify-center items-center py-3">
            <div className="pl-2 text-sm text-[#fb7d5b]">{address}</div>
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

    .course__card__title {
      font-size: 16px;
    }

    .course__card__time {
      font-size: 14px;
    }
  }
`;

export default BranchItem;
