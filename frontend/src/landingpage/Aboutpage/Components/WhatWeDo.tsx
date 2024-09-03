import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import icon from "../../Homepage/Homeimages/subjectIcon.svg";
import skill from "../Aboutimages/skill.svg";
import strong from "../Aboutimages/strong.svg";
import guide from "../Aboutimages/guide.svg";
import functioning from "../Aboutimages/function.svg";

const WhatWeDo = () => {
  useEffect(() => {
    AOS.init({ duration: 1500 });
  }, []);

  const statements = [
    {
      id: 1,
      image: functioning,
      name: "Functional education",
      role: "Our curriculum is designed to provide students with the knowledge and skills they need to succeed in the real world.",
    },
    {
      id: 2,
      image: guide,
      name: "Guided learning",
      role: "Our experienced and dedicated teachers provide students with the support and guidance they need to reach their full potential.",
    },
    {
      id: 3,
      image: strong,
      name: "Strong values",
      role: "We instill in our students important values such as honesty, respect, and compassion.",
    },
    {
      id: 4,
      image: skill,
      name: "Skill development",
      role: "We offer a variety of extracurricular activities and programs to help students develop their skills and interests.",
    },
    {
      id: 5,
      image: icon,
      name: "Innovation and creativity",
      role: "We encourage our students to think outside the box and explore their creative potential.",
    },
  ];

  return (
    <div data-aos="fade-right" className="w-full md:p-10">
      <div className="w-full p-2">
        <div className="md:w-[400px] mx-auto text-center text-4xl font-bold py-2 font-inter ">
          What we offer
        </div>
        <div className=" mb-[45px] md:w-[350px] text-center mx-auto text-sm font-medium ">
          Creative Kiddies Academy is a nurturing and enriching educational
          environment where children thrive. Our benefits include:
        </div>
        <div className="w-full flex gap-x-6 items-center justify-around flex-shrink-0 flex-wrap">
          {statements.map((each) => (
            <div
              key={each.id}
              className="w-[500px] h-[200px] flex flex-col items-center justify-center p-4"
            >
              <div className="py-1 w-8">
                <img src={each.image} className="w-full" />
              </div>
              <div className="w-full font-bold text-center text-xl mb-1 ">
                {each.name}
              </div>
              <div className="text-sm w-full text-center">{each.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatWeDo;
