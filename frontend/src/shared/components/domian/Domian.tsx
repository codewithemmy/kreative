import React from "react";
import { BsFileCheck } from "react-icons/bs";

interface Props {
  remark: any;
}

const Domain: React.FC<Props> = ({ remark }) => {

  const renderSkillsRow = (domain: any) => {
    return Object.entries(domain).map(([skill, rating], index) => (
      <tr key={index}>
        <td className="border border-gray-300 text-black text-sm md:text-normal">
          {skill}
        </td>
        {Array.from({ length: 5 }).map((_, colIndex) => (
          <td
            key={colIndex}
            className="border border-gray-300 text-sm md:text-lg p-1"
          >
            {colIndex + 1 === rating ? <BsFileCheck /> : null}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="w-full py-2 mb-3 mt-[40px]">
      <div className="flex flex-col md:flex-row gap-8 item-center">
      <table className="w-full border-collapse border border-gray-300">
          <thead className="w-full">
            <tr className="w-full">
              <th className="border text-sm md:text-lg text-left border-gray-300 text-hover p-1 w-[60%]">
                Affective Domain
              </th>
              <th className="border border-gray-300 p-1 w-[8%]">1</th>
              <th className="border border-gray-300 p-1 w-[8%]">2</th>
              <th className="border border-gray-300 p-1 w-[8%]">3</th>
              <th className="border border-gray-300 p-1 w-[8%]">4</th>
              <th className="border border-gray-300 p-1 w-[8%]">5</th>
            </tr>
          </thead>
          <tbody>{renderSkillsRow(remark?.affectiveDomain)}</tbody>
        </table>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="w-full">
            <tr className="w-full">
              <th className="border text-sm md:text-lg text-left border-gray-300 text-hover p-1 w-[60%]">
                Psychomotor Domain
              </th>
              <th className="border border-gray-300 p-1 w-[8%]">1</th>
              <th className="border border-gray-300 p-1 w-[8%]">2</th>
              <th className="border border-gray-300 p-1 w-[8%]">3</th>
              <th className="border border-gray-300 p-1 w-[8%]">4</th>
              <th className="border border-gray-300 p-1 w-[8%]">5</th>
            </tr>
          </thead>
          <tbody>{renderSkillsRow(remark?.psychomotorDomain)}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Domain;
