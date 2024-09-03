import React, { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import Navbar from "./Navbar";

const FaqsPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index: any) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  const faqsData = [
    {
      question: "How do I register my child ?",
      answer:
        "With just your full name, phone number and password, you can get started on this platform.",
    },
    {
      question: "How do I register my child ?",
      answer:
        "With just your full name, phone number and password, you can get started on this platform.",
    },
    {
      question: "How do I register my child ?",
      answer:
        "With just your full name, phone number and password, you can get started on this platform.",
    },
    {
      question: "How do I register my child ?",
      answer:
        "With just your full name, phone number and password, you can get started on this platform.",
    },
  ];
  return (
    <>
      <div className="py-6 px-4 md:p-6">
        <div className="w-full text-center text-4xl font-bold mb-4 p-2 font-inter ">
          Frequently asked question
        </div>

        <div className="w-full">
          {faqsData.map((faq, index) => (
            <div className="border-b-2 p-4 bg-white shadow-md" key={index}>
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-center items-center h-[50px]">
                  <div className="">
                    <h2 className="text-[14px] font-medium ">{faq.question}</h2>
                  </div>
                </div>
                {index === activeIndex ? (
                  <BsChevronUp className="h-4 w-4 text-primary" />
                ) : (
                  <BsChevronDown className="h-4 w-4 text-primary" />
                )}
              </div>
              {index === activeIndex && (
                <p className="mt-2 text-gray-700 text-sm">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default FaqsPage;
