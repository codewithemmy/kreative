import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import { errorNotifier } from "../../../../utilities/Toast";
import Spinner from "../../../../utilities/Spinner";

const ClassStudentProfile: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const [studentDetails, setStudentDetails] = useState<any | null>(null);
  const classname = location.state?.classname;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  setTimeout(() => {
    setIsLoading(false);
  }, 300);

  useEffect(() => {
    if (id === undefined || id === null) {
      return;
    }
    if (
      !location?.state?.studentList ||
      !Array.isArray(location?.state?.studentList)
    ) {
      return;
    }

    const student = location?.state?.studentList.find(
      (student: any) => student?._id === id
    );
    if (!student) {
      errorNotifier("Student not loaded");
    }

    setStudentDetails(student || null);
  }, [id]);

  const goBack = () => {
    window.history.back();
  };

  const formattedDateOfBirth = studentDetails?.dateOfBirth?.slice(0, 10);

  return isLoading ? (
    <div className="w-full flex justify-center items-center">
      <Spinner />
    </div>
  ) : (
    <>
      <Wrapper>
        <section className="w-full px-4 md:px-12 pb-12">
          <div className="flex justify-between items-center p-2 md:p-8 lg:p-12 mt-3">
            <h1 className="text-primary font-semibold text-xl md:text-2xl flex">
              Student Profile
            </h1>
            <button
              className="px-[20px] py-[10px] border-[.5px] border-primary md:m-3 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition"
              onClick={goBack}
            >
              Back
            </button>
          </div>

          <div className="my-6 gap-10 bg-white rounded-xl p-4 box-border">
            <div key={studentDetails?._id}>
              <div className="">
                <div className="w-[300px] h-[300px] rounded-md overflow-hidden mb-8">
                  <img
                    className="w-full h-full"
                    src={studentDetails?.profileImage}
                    alt="student"
                  />
                </div>

                <div className="col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className=" font-medium text-gray-800">Name:</p>
                      <p className="font-thin text-gray-600">
                        {studentDetails?.name}
                      </p>
                    </div>
                    <div>
                      <p className=" font-medium text-gray-800">Class:</p>
                      <p className="font-thin text-gray-600">{classname}</p>
                    </div>
                    <div>
                      <p className=" font-medium text-gray-800">
                        Date of Birth:
                      </p>
                      <p className="font-thin text-gray-600">
                        {formattedDateOfBirth}
                      </p>
                    </div>
                    <div>
                      <p className=" font-medium text-gray-800">Student ID:</p>
                      <p className="font-thin text-gray-600">
                        {studentDetails?.validId}
                      </p>
                    </div>
                    <div>
                      <p className=" font-medium text-gray-800">Gender:</p>
                      <p className="font-thin text-gray-600">
                        {studentDetails?.gender}
                      </p>
                    </div>
                    <div>
                      <p className=" font-medium text-gray-800">
                        Phone Number:
                      </p>
                      <p className="font-thin text-gray-600">
                        {studentDetails?.phone}
                      </p>
                    </div>
                    <div>
                      <p className=" font-medium text-gray-800">Email:</p>
                      <p className="font-thin text-gray-600">
                        {studentDetails?.email}
                      </p>
                    </div>
                    <div>
                      <p className=" font-medium text-gray-800">Address:</p>
                      <p className="font-thin text-gray-600">
                        {studentDetails?.address}
                      </p>
                    </div>
                    <div>
                      <p className=" font-medium text-gray-800">
                        House Details:
                      </p>
                      <p className="font-thin text-gray-600">
                        {studentDetails?.houseNameColor}
                      </p>
                    </div>
                    <div>
                      <p className=" font-medium text-gray-800">Parent Name:</p>
                      <p className="font-thin text-gray-600">
                        {studentDetails?.parentName}
                      </p>
                    </div>

                    <div>
                      <p className=" font-medium text-gray-800">
                        Parent Occupation:
                      </p>
                      <p className="font-thin text-gray-600">
                        {studentDetails?.parentOccupation}
                      </p>
                    </div>
                    <div>
                      <p className=" font-medium text-gray-800">City:</p>
                      <p className="font-thin text-gray-600">
                        {studentDetails?.homeTown}
                      </p>
                    </div>

                    <div>
                      <p className=" font-medium text-gray-800">Genotype:</p>
                      <p className="font-thin text-gray-600">
                        {studentDetails?.genotype}
                      </p>
                    </div>
                    <div>
                      <p className=" font-medium text-gray-800">Blood Group:</p>
                      <p className="font-thin text-gray-600">
                        {studentDetails?.bloodGroup}
                      </p>
                    </div>
                    <div>
                      <p className=" font-medium text-gray-800">Hometown:</p>
                      <p className="font-thin text-gray-600">
                        {studentDetails?.homeTown}
                      </p>
                    </div>
                    <div>
                      <p className=" font-medium text-gray-800">State:</p>
                      <p className="font-thin text-gray-600">
                        {studentDetails?.state}
                      </p>
                    </div>
                    <div>
                      <p className=" font-medium text-gray-800">LGA:</p>
                      <p className="font-thin text-gray-600">
                        {studentDetails?.localGovernmentArea}
                      </p>
                    </div>

                    <div>
                      <p className=" font-medium text-gray-800">Nationality:</p>
                      <p className="font-thin text-gray-600">
                        {studentDetails?.nationality}
                      </p>
                    </div>
                    {/* Add more details here */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between px-4 my-2 md:my-4">
            <button
              onClick={goBack}
              className="px-[20px] py-[10px] border-[.5px] border-primary my-8 md:my-6 text-[12px] font-semibold text-primary focus:bg-primary focus:text-white rounded-lg hover:text-white hover:bg-primary transition mb-6 md:mb-0"
            >
              Close
            </button>
          </div>
        </section>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.section`
  .studentsProfile__section {
    background: #f1f3f9;

    .studentsProfile__heading {
      color: #1f155e;
    }
    .close__button {
      background: #193aba;
      color: white;
      text-transform: capitalize !important;
      border-radius: 50px !important;
      padding: 12px 36px;
      font-weight: bold;
      font-size: 15px;
      border: 1px solid #193aba;
    }
  }
`;

export default ClassStudentProfile;
