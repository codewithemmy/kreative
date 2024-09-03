import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  noPerPage: number;
  total: number;
  paginate: (pageNumber: number) => void;
  pageName: string;
  noMatch?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  noPerPage,
  total,
  paginate,
  pageName,
}) => {
  const pageNumbers = Math.ceil(total / noPerPage);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-4">
      <div>
        {pageName !== "" && (
          <span className="mr-2 text-sm text-primary font-semibold">
            Showing {Math.min(currentPage * noPerPage, total)} of {total}{" "}
            {pageName}.
          </span>
        )}
      </div>
      <div className="flex items-center">
        <button
          className="bg-white hover:text-hover text-xs text-primary font-bold py-2 px-4 rounded-[50%] h-10 w-10 ml-2 shadow-md mr-4"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>
        {[...Array(pageNumbers).keys()].map((pageNumber) => (
          <button
            key={pageNumber + 1}
            className={`bg-primary hover:bg-hover text-white text-xs font-bold py-2 px-3 mr-2 rounded ${
              pageNumber + 1 === currentPage
                ? "bg-primary rounded-[50%] text-white"
                : ""
            }`}
            onClick={() => paginate(pageNumber + 1)}
          >
            {pageNumber + 1}
          </button>
        ))}
        <button
          className="bg-white hover:text-hover text-xs text-primary font-bold py-2 px-4 rounded-[50%] h-10 w-10 ml-2 shadow-md"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === pageNumbers}
        >
          <FaChevronRight className="" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;