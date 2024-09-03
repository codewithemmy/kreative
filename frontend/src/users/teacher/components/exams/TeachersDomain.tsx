import React from "react";
import { BsFileCheck } from "react-icons/bs";

interface Props {
  remark: any;
}

const TeachersDomain: React.FC<Props> = ({ remark }) => {
  const formatSkillName = (skill: string) => {
    return skill
      ?.replace(/([a-z])([A-Z])/g, "$1 $2") 
      ?.split(" ")
      ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) 
      ?.join(" ");
  };

  const renderSkillsRow = (domain: any) => {
    return Object?.entries(domain)?.map(([skill, rating], index) => (
      <tr key={index}>
        <td className="border border-gray-300 text-black text-sm md:text-normal">
          {formatSkillName(skill)}
        </td>
        {Array.from({ length: 5 })?.map((_, colIndex) => (
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
    <div className="w-full mb-3">
      <div className="flex flex-col gap-8 item-center p-4">
        {remark?.affectiveDomain && (
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
        )}
        {remark?.psychomotorDomain && (
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
        )}
      </div>
    </div>
  );
};

export default TeachersDomain;