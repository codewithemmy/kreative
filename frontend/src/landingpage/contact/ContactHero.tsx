import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import CustomButton from "../../utilities/CustomButton";
import "./contact.css";

const ContactHero = () => {
  useEffect(() => {
    AOS.init({ duration: 1500 });
  }, []);

  const goToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      data-aos="fade-left"
      className="contacthero h-96 sm:h-[700px] pt-8 pb-3 sm:pb-6 md:pb-10 "
    >
      <div className="md:w-[500px] lg:w-full h-screen md:flex justify-center pt-8 md:pt-20 items-center  text-center mx-auto">
        <div className="w-full flex flex-col justify-center items-center px-2 sm:px-10 md:px-12">
          <div className="text-2xl md:text-4xl text-white font-bold mb-2 sm:leading-relaxed text-center w-full  ">
            Reach out to us, we’ll never leave you unread or hanging.
          </div>
          <div className="md:w-[320px] text-sm text-white font-medium mb-4  text-center ">
            For more info and enquiries about creative kiddies, send us a
            message, or schedule a visit.
          </div>
          <div className="flex flex-col md:flex-row  gap-2  gap-x-3 mx-auto">
            <CustomButton
              onClick={goToContact}
              text="Schedule a visit"
              className="w-full md:w-[200px] bg-primary"
            />
            <CustomButton
              text="Send a message"
              onClick={goToContact}
              className="w-full md:w-[200px] bg-transparent text-primary hover:bg-transparent"
            />
          </div>
        </div>
      </div>
      <div className="hidden md:flex px-3 md:px-10 w-full sm:w-4/5 lg:w-1/2 mx-auto py-1 lg:py-2"></div>
    </div>
  );
};

export default ContactHero;
