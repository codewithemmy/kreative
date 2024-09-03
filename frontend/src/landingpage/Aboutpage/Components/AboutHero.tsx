import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import CustomButton from "../../../utilities/CustomButton";
import "../css/About.css";

const AboutHero = () => {
  useEffect(() => {
    AOS.init({ duration: 1500 });
  }, []);

  return (
    <div
      data-aos="fade-left"
      className="w-full about
      hero h-96 sm:h-[400px] md:h-[700px]  pt-8 pb-3 sm:pb-6 md:pb-10"
    >
      <div className="w-full mx-auto flex flex-col justify-center items-center px-2 sm:px-10 md:px-12">
        <div className="md:w-full text-2xl md:text-5xl text-white font-bold text-center mb-2 mx-auto mt-[2rem] md:mt-[12rem]">
          Creative Kiddies Academy: Where Children Achieve Their Dreams
        </div>
        <div className=" md:w-[600px] text-white font-medium mb-4 mx-auto text-center ">
          Scroll to read more about us, or schedule a visit at any of our
          branches close to you.
        </div>
        <div className="flex flex-col md:flex-row items-start justify-start gap-x-3 gap-2">
          {" "}
          <CustomButton
            text="Schedule a visit"
            className=" w-full md:w-[200px] bg-primary"
          />
          <CustomButton
            text="Send a message"
            className=" w-full md:w-[200px] bg-transparent text-primary hover:bg-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutHero;
