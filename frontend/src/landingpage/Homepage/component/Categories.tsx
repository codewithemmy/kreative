import React from "react";
import { useState } from "react";
import { RiBitCoinLine } from "react-icons/ri";
import { BsPalette } from "react-icons/bs";
import { AiOutlineDollar } from "react-icons/ai";
import { BsMegaphone } from "react-icons/bs";
import { BsMusicNoteBeamed } from "react-icons/bs";
import play from "../Homeimages/play.svg";
import creche from "../Homeimages/creche.svg";
import elementary from "../Homeimages/elementary.svg";
import { FaPuzzlePiece } from "react-icons/fa";
import icon from "../Homeimages/subjectIcon.svg";
import icon2 from "../Homeimages/sectionIcon.svg";

const Categories = () => {
  const subjects = [
    {
      id: 1,
      icon: icon,
      title: "Blockchain",
      post: "Lorem ipsum dolor sit amet consectetur, elit temporibus, qui",
    },
    {
      id: 2,
      icon: icon,
      title: "Graphic Design",
      post: "Lorem ipsum dolor sit amet consectetur, elit temporibus, qui",
    },
    {
      id: 3,
      icon: icon,
      title: "Finance",
      post: "Lorem ipsum dolor sit amet consectetur, elit temporibus, qui",
    },
    {
      id: 4,
      icon: icon,
      title: "Marketing",
      post: "Lorem ipsum dolor sit amet consectetur, elit temporibus, qui",
    },
    {
      id: 5,
      icon: icon,
      title: "Music",
      post: "Lorem ipsum dolor sit amet consectetur, elit temporibus, qui",
    },
    {
      id: 6,
      icon: icon,
      title: "Business",
      post: "Lorem ipsum dolor sit amet consectetur, elit temporibus, qui",
    },
  ];

  const cards = [
    {
      id: 1,
      icon: icon2,
      img: play,
      title: "PlayGroup",
      post: "6 months - 1 year old",
    },
    {
      id: 2,
      icon: icon2,
      img: creche,
      title: "Creche",
      post: "2 - 5 years old",
    },
    {
      id: 3,
      icon: icon2,
      img: elementary,
      title: "Elementary School",
      post: "From primary 1 - 5",
    },
  ];

  return (
    <div className="md:p-4">
      <div className="flex flex-col justify-center items-center mb-[40px] p-4 ">
        <div className="w-full text-center text-4xl font-bold  p-2 font-inter ">
          Classes and Programs
        </div>
        <div className="w-full sm:w-[380px] text-center text-sm font-medium leading-relaxed ">
          Our respective classes and programs, shape our students into brilliant
          minds and future creatives. Below are our classes and programs:
        </div>
        {/* <a href='#'>Learn More</a> */}
      </div>
      <div className="w-full flex flex-col md:flex-row items-center px-[10px] flex-shrink-0 md:flex-nowrap md:overflow-x-scroll gap-x-[100px] gap-y-[20px] mb-[60px] ">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="md:w-[500px] flex items-start justify-around gap-x-3 p-4 "
          >
            <div className="py-1 w-4">
              <img src={subject.icon} className="w-full" />
            </div>
            <div className="md:w-[300px] ">
              <div className="w-full font-bold ">{subject.title}</div>
              <div className="text-xs w-full">{subject.post}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex flex-col lg:flex-row items-center lg:px-[10px] p-4 flex-shrink-0 lg:flex-nowrap lg:overflow-x-scroll gap-[20px] mb-[60px] ">
        {cards.map((section) => (
          <div
            key={section.id}
            className="lg:w-[500px] w-full rounded-2xl h-[300px] md:h-[550px] lg:h-[450px] p-4 bg-cover bg-center bg-no-repeat transition duration-300 transform hover:scale-101 hover:rounded-2xl"
            style={{
              backgroundImage: `linear-gradient(
                to bottom,
                rgba(59, 67, 50, 0.5),
                rgba(52, 73, 3, 0.3)
              ), url(${section.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="md:w-[400px] h-full relative">
              <div className="w-full flex gap-x-3 p-4 absolute left-[2px] bottom-[10px] ">
                <div className="py-1 w-4">
                  <img src={section.icon} className="w-full" />
                </div>
                <div className="w-[300px] ">
                  <div className="w-full font-bold text-white ">
                    {section.title}
                  </div>
                  <div className="text-xs w-ful text-white">{section.post}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
