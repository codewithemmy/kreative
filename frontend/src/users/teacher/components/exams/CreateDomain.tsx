import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import domainData from "../../../../data/creative.json";

interface Props {
  handleCloseDomainForm: () => void;
  remarkId: string;
}

interface Domain {
  affectiveDomain?: string[];
  psychomotorDomain?: string[];
}

const AddDomain: React.FC<Props> = ({ remarkId, handleCloseDomainForm }) => {
  const { access, sent, setSent } = useContext(Context);
  const { handleSubmit } = useForm<any>();
  const [newDomainName, setNewDomainName] = useState<string>("");
  const [newSkillName, setNewSkillName] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(1);

  const handleCloseForm = () => {
    setNewDomainName("");
    setNewSkillName("");
    setNewRating(1);
    handleCloseDomainForm();
  };

  const toCamelCase = (str: string) => {
    return str
      .split(" ")
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join("");
  };

  const onSubmit = async () => {
    if (!newDomainName && !newSkillName) {
      return;
    }

    const camelCaseSkillName = toCamelCase(newSkillName);

    const newDomain = {
      [camelCaseSkillName]: newRating,
    };
    
    try {
      const response = await ApiAuth.patch(
        `/remarks/domain/${remarkId}`,
        newDomain,
        {
          headers: {
            Authorization: "Bearer " + access?.userToken,
          },
        }
      );
      setSent(!sent);
      handleCloseForm();
      successNotifier("Success!");
    } catch (error) {
      errorNotifier("Error!");
    }
  };

  const getSkillsForDomain = (domain: string): string[] => {
    const domainObject = domainData?.domain.find((d) => domain in d);
    return domainObject ? domainObject[domain as keyof Domain] || [] : [];
  };

  return (
    <div className="p-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-white shadow-md rounded-lg mx-auto"
      >
        <div className="">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="domainName"
          >
            Domain Name
          </label>
          <select
            id="domainName"
            value={newDomainName}
            onChange={(e) => setNewDomainName(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Select Domain Type"
          >
            <option value="" disabled>
              Select Domain
            </option>
            {domainData?.domain?.map((domain, i) => {
              const key = Object.keys(domain)[0];
              return (
                <option key={i} value={key}>
                  {key}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="skillName"
            >
              Skill Name
            </label>
            <select
              id="skillName"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="" disabled>
                Select Skill
              </option>
              {getSkillsForDomain(newDomainName).map((skill, i) => (
                <option key={i} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1" htmlFor="rating">
              Rating
            </label>
            <select
              id="rating"
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              className="w-full border border-gray-300 rounded p-2"
            >
              {Array.from({ length: 5 }).map((_, colIndex) => (
                <option key={colIndex} value={colIndex + 1}>
                  {colIndex + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              type="submit"
              onClick={onSubmit}
              className="px-[20px] mr-2 py-[10px] border-[.5px] border-primary md:m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
            >
              Add
            </button>
            <button
              type="button"
              onClick={handleCloseForm}
              className="px-[20px] py-[10px] border-[.5px] border-[#CC400C] md:m-3 text-[12px] font-semibold text-[#CC400C] focus:bg-[#CC400C] focus:text-white rounded-lg hover:text-white hover:bg-[#CC400C] transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDomain;
