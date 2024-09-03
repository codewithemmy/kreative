import styled from "styled-components";
import { Button } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ApiAuth from "../../../../api/ApiAuth";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import { Context } from "../../../../context/Context";

const AddNewTeacher: React.FC = () => {
  const { adminAccess, adminDetails, sent, setSent, loadAdminDetails } = useContext(Context);
  const [branchList, setBranchList] = useState<any[]>([]);
  const [files, setFiles] = useState<File | null>();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();

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
      console.log(response.data);
      setBranchList(response?.data.data);
    } catch (error) {
      console.log(error);
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
    setIsLoading(true);
    data.email = data.email.toLowerCase();
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
      console.log("Response:", response.data);
      successNotifier("Teacher created successfully!");
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
            <h1 className="text-primary font-semibold text-xl md:text-2xl flex flex-grow">
              Add New Teacher
            </h1>
            <button
              className="px-[20px] py-[10px] border-[.5px] border-primary m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
              onClick={goBack}
            >
              Back
            </button>
          </div>

          {/* Add New student Form Area  */}
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
                      className="text-gray-600 text-lg py-2  inline-block"
                      htmlFor="name"
                    >
                      Full Name*
                    </label>
                    <input
                      className="w-full py-2 pl-4 mb-2 border border-gray-200 rounded-lg outline-none"
                      type="text"
                      id="name"
                      {...register("name")}
                    />

                    <label
                      className="text-gray-600 text-lg py-2 inline-block"
                      htmlFor="email"
                    >
                      Email*
                    </label>
                    <input
                      className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                      type="text"
                      id="email"
                      {...register("email")}
                    />

                    <input
                      hidden
                      className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                      type="text"
                      {...register("password")}
                      value="password"
                    />

                    <label
                      className="text-gray-600 text-lg py-2 inline-block"
                      htmlFor="dateOfBirth"
                    >
                      Date of Birth*
                    </label>
                    <input
                      className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                      type="date"
                      id="dateOfBirth"
                      {...register("dateOfBirth")}
                    />

                    <label
                      className="text-gray-600 text-lg py-2 inline-block"
                      htmlFor="maritalStatus"
                    >
                      Marital Status*
                    </label>
                    <select
                      className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                      id="maritalStatus"
                      {...register("maritalStatus")}
                    >
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                    </select>

                    <label
                      className="text-gray-600 text-lg py-2  inline-block"
                      htmlFor="houseNameColor"
                    >
                      House Details*
                    </label>
                    <input
                      className="w-full py-2 pl-4 mb-2 border border-gray-200 rounded-lg outline-none"
                      type="text"
                      id="houseNameColor"
                      {...register("houseNameColor")}
                    />
                    {/* <label
                      className="text-gray-600 text-lg py-2 inline-block"
                      htmlFor="city"
                    >
                      City*
                    </label>
                    <input
                      className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                      id="city"
                      {...register("city")}
                    /> */}
                    <label
                      className="text-gray-600 text-lg py-2 inline-block"
                      htmlFor="homeTown"
                    >
                      Home Town*
                    </label>
                    <input
                      className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                      type="text"
                      id="homeTown"
                      {...register("homeTown")}
                    />

                    <label
                      className="text-gray-600 text-lg py-2 inline-block"
                      htmlFor="nationality"
                    >
                      Nationality*
                    </label>
                    <input
                      className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                      id="nationality"
                      {...register("nationality")}
                    />
                    <label
                      className="text-gray-600 text-lg py-2 inline-block"
                      htmlFor="referee"
                    >
                      Referee*
                    </label>
                    <input
                      className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                      id="referee"
                      {...register("referee")}
                    />
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div>
                    <label
                      className="text-gray-600 text-lg py-2  inline-block"
                      htmlFor="phone"
                    >
                      Phone Number*
                    </label>
                    <input
                      className="w-full py-2 pl-4 mb-2 border border-gray-200 rounded-lg outline-none"
                      type="text"
                      id="phone"
                      {...register("phone")}
                    />

                    <label
                      className="text-gray-600 text-lg py-2 inline-block"
                      htmlFor="subject"
                    >
                      Subject*
                    </label>
                    <input
                      className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                      type="text"
                      id="subject"
                      {...register("subject")}
                    />

                    <label
                      className="text-gray-600 text-lg py-2 inline-block"
                      htmlFor="intendedClass"
                    >
                      Class*
                    </label>
                    <select
                      id="intendedClass"
                      className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                      {...register("intendedClass", { required: true })}
                    >
                      {" "}
                      <option value="">Select Class</option>
                      <option value="None">None</option>
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

                    <label
                      className="text-gray-600 text-lg py-2 inline-block"
                      htmlFor="gender"
                    >
                      Gender*
                    </label>
                    <select
                      id="gender"
                      className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                      {...register("gender")}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <label
                      className="text-gray-600 text-lg py-2  inline-block"
                      htmlFor="address"
                    >
                      Address*
                    </label>
                    <input
                      className="w-full py-2 pl-4 mb-2 border border-gray-200 rounded-lg outline-none"
                      type="text"
                      id="address"
                      {...register("address")}
                    />

                    <input
                      hidden
                      type="text"
                      id="accountType"
                      {...register("accountType")}
                      value="teacher"
                    />

                    <label
                      className="text-gray-600 text-lg py-2 inline-block"
                      htmlFor="localGovernmentArea"
                    >
                      L.G.A*
                    </label>
                    <input
                      className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                      id="localGovernmentArea"
                      {...register("localGovernmentArea")}
                    />
                    <label
                      className="text-gray-600 text-lg py-2 inline-block"
                      htmlFor="state"
                    >
                      State*
                    </label>
                    <input
                      className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                      id="state"
                      {...register("state")}
                    />

                    <label
                      className="text-gray-600 text-lg py-2 inline-block"
                      htmlFor="refereeAddress"
                    >
                      Referee Address*
                    </label>
                    <input
                      className="w-full py-2 pl-4 border border-gray-200 rounded-lg outline-none"
                      id="refereeAddress"
                      {...register("refereeAddress")}
                    />
                  </div>
                </div>
                <div className="col-span-full">
                  <div className="flex justify-end items-center mt-6 flex-nowrap gap-4">
                    <Button
                      type="button"
                      className="cancel__button"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="submit__button">
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
  }
`;

export default AddNewTeacher;
