import React from "react";

const ResultTemplate: React.FC = () => {
  return (
    <div className="grid place-items-center m-8">
      <div className="border border-black w-3/5 p-12">
        <header>
          <div className="text-center">
            <h2>ANAMBR STATE SCHOOL SYSTEM</h2>
            <h1 className="text-blue-900 my-1">CREATIVE KIDDIES ACADEMY</h1>
            <h5 className="text-red-600 text-xl my-1">(Government Approved)</h5>
            <h6 className="text-xl my-1">
              <span className="text-red-600 font-semibold">Motto:</span>{" "}
              Creating a Formidable Future, One Child at a Time!
            </h6>
          </div>
          <div className="flex justify-around items-center">
            <div>
              <h4 className="text-red-600 font-semibold">Mkpolo Branch</h4>
              <p className="text-blue-600 text-sm">Umukwa Road</p>
              <p className="text-blue-600 text-sm">Behind St. Faith Anglican</p>
              <p className="text-blue-600 text-sm">Church Awka</p>
            </div>
            <div>
              <h4 className="text-red-600 font-semibold">New World Branch</h4>
              <p className="text-blue-600 text-sm">Akamanato Mgbakwu,</p>
              <p className="text-blue-600 text-sm">Awka,</p>
              <p className="text-blue-600 text-sm">Anambra State</p>
            </div>
            <div>
              <h4 className="text-red-600 font-semibold">Awada Branch</h4>
              <p className="text-blue-600 text-sm">
                No. 67 Goody Ezenagu Avenue
              </p>
              <p className="text-blue-600 text-sm">Amaede village, Mgbakwu,</p>
              <p className="text-blue-600 text-sm">Anambra State</p>
            </div>
          </div>
        </header>
        <h1 className="bg-blue-900 text-white text-center text-lg my-1 p-1">
          STATEMENT OF RESULT FOR JUNIOR SECONDARY SCHOOL.
        </h1>
        <div className="h-20 p-1 flex flex-col">
          <p className="w-full text-lg flex pb-1">
            Name:{" "}
            <span className="flex-1 ml-1 border-b border-dotted border-black"></span>
          </p>
          <div className="flex">
            <span className="flex-1 flex pb-1">
              Class:{" "}
              <span className="flex-1 ml-1 border-b border-dotted border-black"></span>
            </span>
            <span className="flex-1 flex pb-1">
              Exam. No:{" "}
              <span className="flex-1 ml-1 border-b border-dotted border-black"></span>
            </span>
          </div>
          <div className="flex">
            <span className="flex-1 flex pb-1">
              Term:{" "}
              <span className="flex-1 border-b border-dotted border-black"></span>
            </span>
            <span className="flex-1 flex pb-1">
              Session:{" "}
              <span className="flex-1 border-b border-dotted border-black"></span>
            </span>
          </div>
        </div>
        <h1 className="text-blue-900 text-center text-xl font-extrabold mt-1">
          THE FOLLOWING ARE THE DETAILS OF YOUR RESULT.
        </h1>
        <table className="border-4 border-red-600 w-full my-2 px-2 border-collapse">
          <thead>
            <tr className="border border-red-600">
              <th className="px-3 font-semibold">SUBJECTS</th>
              <th className="px-1 font-semibold">TEST</th>
              <th className="px-1 font-semibold">EXAM</th>
              <th className="px-1 font-semibold">TOTAL</th>
              <th className="px-1 font-semibold">GRADE</th>
              <th className="px-1 font-semibold">RESULT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ENGLISH LANGUAGE</td>
              <td>22</td>
              <td>50</td>
              <td>70</td>
              <td>A</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>MATHEMATICS</td>
              <td>22</td>
              <td>50</td>
              <td>70</td>
              <td>A</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>IGBO</td>
              <td>22</td>
              <td>50</td>
              <td>70</td>
              <td>A</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>BASIC TECHNOLOGY</td>
              <td>22</td>
              <td>50</td>
              <td>70</td>
              <td>A</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>SOCIAL STUDIES</td>
              <td>22</td>
              <td>50</td>
              <td>70</td>
              <td>A</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>ENGLISH LANGUAGE</td>
              <td>22</td>
              <td>50</td>
              <td>70</td>
              <td>A</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>CIVICS EDUCATION</td>
              <td>22</td>
              <td>50</td>
              <td>70</td>
              <td>A</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>COMPUTER SCIENCE</td>
              <td>22</td>
              <td>50</td>
              <td>70</td>
              <td>A</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>AGRICULTURAL SCIENCE</td>
              <td>22</td>
              <td>50</td>
              <td>70</td>
              <td>A</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>CULTURAL & CREATIVE ART</td>
              <td>22</td>
              <td>50</td>
              <td>70</td>
              <td>A</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>C.R.S</td>
              <td>22</td>
              <td>50</td>
              <td>70</td>
              <td>A</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>BUSINESS STUDIES</td>
              <td>22</td>
              <td>50</td>
              <td>70</td>
              <td>A</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>HOME ECONOMICS</td>
              <td>22</td>
              <td>50</td>
              <td>70</td>
              <td>A</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>PHYSICAL & HEALTH EDU.</td>
              <td>22</td>
              <td>50</td>
              <td>70</td>
              <td>A</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>MORAL INSTRUCTION</td>
              <td>22</td>
              <td>50</td>
              <td>70</td>
              <td>A</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>FRENCH</td>
              <td>22</td>
              <td>50</td>
              <td>70</td>
              <td>A</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>MUSIC</td>
              <td>22</td>
              <td>50</td>
              <td>70</td>
              <td>A</td>
              <td>Excellent</td>
            </tr>
          </tbody>
        </table>
        <footer className="mt-2">
          <div className="flex font-semibold text-blue-900 py-1 my-1">
            <div className="flex-1 flex">
              Total Score:{" "}
              <span className="flex-1 border-b border-black ml-1"></span>
            </div>
            <div className="flex-1 flex">
              Top Score:{" "}
              <span className="flex-1 border-b border-black ml-1"></span>
            </div>
            <div className="flex-1 flex">
              Average Score:{" "}
              <span className="flex-1 border-b border-black ml-1"></span>
            </div>
            <div className="flex-1 flex">
              Average Grade:{" "}
              <span className="flex-1 border-b border-black ml-1"></span>
            </div>
          </div>
          <div className="flex font-semibold text-blue-900 py-1 my-1">
            <div className="flex-1 flex">
              Position:{" "}
              <span className="flex-1 border-b border-black ml-1"></span>
            </div>
            <div className="flex-1 flex">
              Out of:{" "}
              <span className="flex-1 border-b border-black ml-1"></span>
            </div>
          </div>
          <div className="flex font-semibold text-blue-900 py-1 my-1">
            <div className="flex-1 flex">
              Comment:{" "}
              <span className="flex-1 border-b border-black ml-1"></span>
            </div>
          </div>
          <div className="flex font-semibold text-blue-900 py-1 my-1">
            <div className="flex flex-1">
              Resumption Date:{" "}
              <span className="flex-1 border-b border-black ml-1"></span>
            </div>
            <div className="flex flex-1">
              Principal:{" "}
              <span className="flex-1 border-b border-black ml-1"></span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ResultTemplate;
