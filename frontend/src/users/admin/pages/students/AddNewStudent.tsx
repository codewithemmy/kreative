import styled from "styled-components";
import { Button } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";

const AddNewStudent: React.FC = () => {
  const { adminAccess, adminDetails, sent, setSent, loadAdminDetails } = useContext(Context);
  const [branchList, setBranchList] = useState<any[]>([]);
  const [files, setFiles] = useState<File | null>();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleGetClass = async () => {
    if (!adminDetails) {
      loadAdminDetails();
      return
    }
    try {
      const response =
        adminAccess?.accountType === "admin"
          ? await ApiAuth.get(`/class?branchId=${adminDetails?.[0].branchId}`, {
              headers: {
                Authorization: "Bearer " + adminAccess?.userToken,
              },
            })
          : await ApiAuth.get(`/class`, {
              headers: {
                Authorization: "Bearer " + adminAccess?.userToken,
              },
            });
      setIsLoading(false);
      setBranchList(response?.data.data);
    } catch (error: any) {
    }
  };

  useEffect(() => {
    if (adminDetails) {
      handleGetClass();
    }
  }, [adminDetails]);

  useEffect(() => {
    handleGetClass();
  }, []);

  const onSubmit = async (data: any) => {
    data.email = data.email.toLowerCase();
    setIsLoading(true);
    try {
      const response = await ApiAuth.post("/user", data, {
        headers: {
          Authorization: `Bearer ${adminAccess?.userToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      reset();
      setFiles(null);
      setIsLoading(false);
      setSent(!sent);
      successNotifier("Student created successfully!");
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error:", error);
      errorNotifier(error?.response.data.message);
    }
  };

  const handleCancel = () => {
    reset();
    setFiles(null);
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <>
      <Wrapper>
        <section className="add__courses__section px-4 md:px-12 pb-12">
          <div className="flex justify-between items-center p-4 md:p-12">
            <h1 className="add__courses__heading font-semibold text-xl md:text-2xl flex flex-grow">
              Add New Student
            </h1>
            <button
              className="px-[20px] py-[10px] border-[.5px] border-primary m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
              onClick={goBack}
            >
              Back
            </button>
          </div>
          <div className="new__course__wrapper bg-white rounded-xl shadow-lg p-8 box-border">
            <h3 className="font-semibold text-gray-700 pb-4 border-b border-gray-400 text-lg">
              Basic Info
            </h3>

            <div className="mt-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <div className="mb-6">
                  <div className="upload__area__1 border border-dashed border-gray-400 rounded-xl">
                    <label
                      htmlFor="img"
                      className="flex justify-center items-center flex-col mt-9"
                    >
                      <i className="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
                      <span className="text-gray-400 font-semibold">
                        Photo*
                      </span>
                    </label>
                    {files && (
                      <div className="mt-[-50px]">
                        <img
                          src={URL.createObjectURL(files)}
                          style={{
                            width: "100%",
                            height: "160px",
                            objectFit: "cover",
                          }}
                          alt="preview"
                        />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    hidden
                    id="img"
                    className=""
                    onChange={(e) => {
                      e.preventDefault();
                      e?.target?.files && setFiles(e?.target?.files[0]);
                      e?.target?.files &&
                        setValue("profileImage", e?.target?.files[0]);
                    }}
                    placeholder="Upload Your Files"
                  />
                </div>
                <div className="col-span-1">
                  <div>
                    <label
                      className={`text-gray-600 text-lg py-2  inline-block ${
                        errors.name ? "text-red-500 font-semibold text-xs" : ""
                      }`}
                      htmlFor="name"
                    >
                      Name*
                    </label>
                    <input
                      className={`w-full py-2 pl-4 mb-2 border border-gray-200 rounded-lg outline-none ${
                        errors.name ? "border-red-500" : ""
                      }`}
                      type="text"
                      id="name"
                      {...register("name", { required: true })}
                    />
                    {errors.name && (
                      <span className="text-red-500 font-semibold text-xs">
                        This field is required
                      </span>
                    )}
                    <label
                      className={`text-gray-600 text-lg py-2 inline-block ${
                        errors.parentName
                          ? "text-red-500 font-semibold text-xs"
                          : ""
                      }`}
                      htmlFor="parentName"
                    >
                      Parent Name*
                    </label>
                    <input
                      className={`w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none ${
                        errors.parentName ? "border-red-500" : ""
                      }`}
                      type="text"
                      id="parentName"
                      {...register("parentName", { required: true })}
                    />
                    {errors.parentName && (
                      <span className="text-red-500 font-semibold text-xs">
                        This field is required
                      </span>
                    )}
                    <label
                      className={`text-gray-600 text-lg py-2 inline-block ${
                        errors.email ? "text-red-500 font-semibold text-xs" : ""
                      }`}
                      htmlFor="email"
                    >
                      Email*
                    </label>
                    <input
                      className={`w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      type="text"
                      id="email"
                      {...register("email", { required: true })}
                    />
                    {errors.email && (
                      <span className="text-red-500 font-semibold text-xs">
                        This field is required
                      </span>
                    )}
                    <input
                      hidden
                      className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                      type="text"
                      {...register("password")}
                      value="password"
                    />
                    <label
                      className={`text-gray-600 text-lg py-2 inline-block ${
                        errors.dateOfBirth
                          ? "text-red-500 font-semibold text-xs"
                          : ""
                      }`}
                      htmlFor="dateOfBirth"
                    >
                      Date of Birth*
                    </label>
                    <input
                      className={`w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none ${
                        errors.dateOfBirth ? "border-red-500" : ""
                      }`}
                      type="date"
                      id="dateOfBirth"
                      {...register("dateOfBirth", { required: true })}
                    />
                    {errors.dateOfBirth && (
                      <span className="text-red-500 font-semibold text-xs">
                        This field is required
                      </span>
                    )}
                    <label
                      className={`text-gray-600 text-lg py-2 inline-block ${
                        errors.bloodGroup
                          ? "text-red-500 font-semibold text-xs"
                          : ""
                      }`}
                      htmlFor="bloodGroup"
                    >
                      Blood Group*
                    </label>
                    <input
                      className={`w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none ${
                        errors.bloodGroup ? "border-red-500" : ""
                      }`}
                      id="bloodGroup"
                      {...register("bloodGroup", { required: true })}
                    />
                    {errors.bloodGroup && (
                      <span className="text-red-500 font-semibold text-xs">
                        This field is required
                      </span>
                    )}
                    <label
                      className={`text-gray-600 text-lg py-2 inline-block ${
                        errors.parentOccupation
                          ? "text-red-500 font-semibold text-xs"
                          : ""
                      }`}
                      htmlFor="parentOccupation"
                    >
                      Parent Occupation*
                    </label>
                    <input
                      className={`w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none ${
                        errors.parentOccupation ? "border-red-500" : ""
                      }`}
                      type="text"
                      id="parentOccupation"
                      {...register("parentOccupation", { required: true })}
                    />
                    {errors.parentOccupation && (
                      <span className="text-red-500 font-semibold text-xs">
                        This field is required
                      </span>
                    )}
                    <label
                      className={`text-gray-600 text-lg py-2  inline-block ${
                        errors.houseNameColor
                          ? "text-red-500 font-semibold text-xs"
                          : ""
                      }`}
                      htmlFor="houseNameColor"
                    >
                      House Details*
                    </label>
                    <input
                      className={`w-full py-2 pl-4 mb-2 border border-gray-200 rounded-lg outline-none ${
                        errors.houseNameColor ? "border-red-500" : ""
                      }`}
                      type="text"
                      id="houseNameColor"
                      {...register("houseNameColor", { required: true })}
                    />
                    {errors.houseNameColor && (
                      <span className="text-red-500 font-semibold text-xs">
                        This field is required
                      </span>
                    )}
                    <label
                      className={`text-gray-600 text-lg py-2 inline-block ${
                        errors.state ? "text-red-500 font-semibold text-xs" : ""
                      }`}
                      htmlFor="state"
                    >
                      State*
                    </label>
                    <input
                      className={`w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none ${
                        errors.state ? "border-red-500" : ""
                      }`}
                      id="state"
                      {...register("state", { required: true })}
                    />
                    {errors.state && (
                      <span className="text-red-500 font-semibold text-xs">
                        This field is required
                      </span>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div>
                    <label
                      className={`text-gray-600 text-lg py-2 inline-block ${
                        errors.phone ? "text-red-500 font-semibold text-xs" : ""
                      }`}
                      htmlFor="phone"
                    >
                      Parent Number*
                    </label>
                    <input
                      className={`w-full py-2 pl-4 mb-2 border border-gray-200 rounded-lg outline-none ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                      type="text"
                      id="phone"
                      {...register("phone", { required: true })}
                    />
                    {errors.phone && (
                      <span className="text-red-500 font-semibold text-xs">
                        This field is required
                      </span>
                    )}
                    <label
                      className={`text-gray-600 text-lg py-2 inline-block ${
                        errors.intendedClass
                          ? "text-red-500 font-semibold text-xs"
                          : ""
                      }`}
                      htmlFor="intendedClass"
                    >
                      Class*
                    </label>
                    <select
                      id="intendedClass"
                      className={`w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none overflow-y-scroll ${
                        errors.intendedClass ? "border-red-500" : ""
                      }`}
                      {...register("intendedClass", { required: true })}
                    >
                      <option value="">Select Class</option>
                      {branchList.map((branch) => (
                        <option
                          key={branch?._id}
                          value={branch?._id}
                          className=""
                        >
                          {branch?.name}
                        </option>
                      ))}
                    </select>
                    {errors.intendedClass && (
                      <span className="text-red-500 font-semibold text-xs">
                        This field is required
                      </span>
                    )}
                    <label
                      className={`text-gray-600 text-lg py-2 inline-block ${
                        errors.gender
                          ? "text-red-500 font-semibold text-xs"
                          : ""
                      }`}
                      htmlFor="gender"
                    >
                      Gender*
                    </label>
                    <select
                      id="gender"
                      className={`w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none ${
                        errors.gender ? "border-red-500" : ""
                      }`}
                      {...register("gender", { required: true })}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.gender && (
                      <span className="text-red-500 font-semibold text-xs">
                        This field is required
                      </span>
                    )}
                    <label
                      className={`text-gray-600 text-lg py-2 inline-block ${
                        errors.genotype
                          ? "text-red-500 font-semibold text-xs"
                          : ""
                      }`}
                      htmlFor="genotype"
                    >
                      Genotype*
                    </label>
                    <input
                      className={`w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none ${
                        errors.genotype ? "border-red-500" : ""
                      }`}
                      id="genotype"
                      {...register("genotype", { required: true })}
                    />
                    {errors.genotype && (
                      <span className="text-red-500 font-semibold text-xs">
                        This field is required
                      </span>
                    )}
                    <label
                      className={`text-gray-600 text-lg py-2  inline-block ${
                        errors.address
                          ? "text-red-500 font-semibold text-xs"
                          : ""
                      }`}
                      htmlFor="address"
                    >
                      Address*
                    </label>
                    <input
                      className={`w-full py-2 pl-4 mb-2 border border-gray-200 rounded-lg outline-none ${
                        errors.address ? "border-red-500" : ""
                      }`}
                      type="text"
                      id="address"
                      {...register("address", { required: true })}
                    />
                    {errors.address && (
                      <span className="text-red-500 font-semibold text-xs">
                        This field is required
                      </span>
                    )}
                    <label
                      className={`text-gray-600 text-lg py-2 inline-block ${
                        errors.homeTown
                          ? "text-red-500 font-semibold text-xs"
                          : ""
                      }`}
                      htmlFor="homeTown"
                    >
                      Home Town*
                    </label>
                    <input
                      className={`w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none ${
                        errors.homeTown ? "border-red-500" : ""
                      }`}
                      type="text"
                      id="homeTown"
                      {...register("homeTown", { required: true })}
                    />
                    {errors.homeTown && (
                      <span className="text-red-500 font-semibold text-xs">
                        This field is required
                      </span>
                    )}
                    <input
                      hidden
                      type="text"
                      id="accountType"
                      {...register("accountType")}
                      value="student"
                    />
                    <label
                      className={`text-gray-600 text-lg py-2 inline-block ${
                        errors.localGovernmentArea
                          ? "text-red-500 font-semibold text-xs"
                          : ""
                      }`}
                      htmlFor="localGovernmentArea"
                    >
                      L.G.A*
                    </label>
                    <input
                      className={`w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none ${
                        errors.localGovernmentArea ? "border-red-500" : ""
                      }`}
                      id="localGovernmentArea"
                      {...register("localGovernmentArea", { required: true })}
                    />
                    {errors.localGovernmentArea && (
                      <span className="text-red-500 font-semibold text-xs">
                        This field is required
                      </span>
                    )}
                    <label
                      className={`text-gray-600 text-lg py-2 inline-block ${
                        errors.nationality
                          ? "text-red-500 font-semibold text-xs"
                          : ""
                      }`}
                      htmlFor="nationality"
                    >
                      Nationality*
                    </label>
                    <input
                      className={`w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none ${
                        errors.nationality ? "border-red-500" : ""
                      }`}
                      id="nationality"
                      {...register("nationality", { required: true })}
                    />
                    {errors.nationality && (
                      <span className="text-red-500 font-semibold text-xs">
                        This field is required
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-span-full">
                  <div className="flex justify-end items-center mt-6 flex-nowrap gap-4">
                    <Button
                      type="button"
                      className="cancel__button border-primary hover:bg-hover hover:text-white"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="submit__button bg-primary hover:bg-hover text-white"
                    >
                      {isLoading ? "Submitting..." : "Submit"}
                    </Button>
                  </div>{" "}
                </div>
              </form>
            </div>
          </div>
        </section>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.section`
  .add__courses__section {
    background: #f1f3f9;

    .add__courses__heading {
      color: #6c1eeb;
      margin: 0px;
    }
    .upload__area__1 {
      width: 100%;
      height: 160px;
      position: relative;
    }
    .uploaded__image {
      position: absolute;
      top: 0px;
      left: 0px;
    }
    .submit__button {
      color: white;
      background-color: #6c1eeb;
      text-transform: capitalize !important;
      border-radius: 50px !important;
      padding: 12px 36px;
      font-weight: bold;
      font-size: 15px;
      border: 1px solid #193aba;
    }
    .cancel__button {
      color: #6c1eeb;
      text-transform: capitalize !important;
      border-radius: 50px !important;
      padding: 12px 36px;
      font-size: 15px;
      border: 1px solid #6c1eeb;
      font-weight: bold !important;
    }
    input[type="text"],
    select {
      &::placeholder {
        color: #ccc;
      }
    }
    input[type="date"] {
      &::-webkit-calendar-picker-indicator {
        filter: invert(1);
      }
    }
    input[type="file"] {
      &::-webkit-file-upload-button {
        visibility: hidden;
      }
      &::before {
        content: "Upload";
        color: white;
        background-color: #6c1eeb;
        border: none;
        border-radius: 5px;
        padding: 8px 12px;
        outline: none;
        display: inline-block;
        cursor: pointer;
      }
    }
    .required-label {
      color: red;
      font-size: 10px;
      display: block;
      margin-top: 2px;
    }
  }
`;

export default AddNewStudent;
