import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import CustomButton from "../../../utilities/CustomButton";
import "../css/Home.css";
// import { useNavigate } from "react-router-dom";

import gallery from "../../GalleryPage/gallery.json";

const galleryImages = gallery.splice(0, 3).map((img) => img.image);
const Hero = () => {
  useEffect(() => {
    AOS.init({ duration: 1500 });
    const interval = setInterval(() => {
      setBgImage((prevIndex) => (prevIndex + 1) % galleryImages.length);
    }, 5000); // Change image every 2 seconds

    return () => clearInterval(interval); //
  }, [galleryImages]);

  const [bgImage, setBgImage] = useState(0);

  // const navigate = useNavigate();

  const goToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full">
      <div
        data-aos="fade-left"
        className="hero h-96 md:h-[700px] pt-8 pb-3 sm:pb-6 md:pb-10"
        style={{
          backgroundImage: `linear-gradient(
            to bottom,
            rgba(11, 4, 4, 0.7),
            rgba(53, 38, 5, 0.6)
          ),url(${galleryImages[bgImage]})`,
          transition: "background-image 1s ease-in-out",
        }}
      >
        <div className="md:w-[450px] lg:w-full md:h-screen md:flex justify-center pt-[4rem] md:pt-44 items-start mx-auto">
          <div className="w-full flex flex-col justify-start items-start px-2 sm:px-10 ">
            <div className="text-2xl md:text-4xl lg:text-6xl text-white font-bold mb-2 sm:leading-relaxed text-center  lg:w-[80%] mx-auto ">
              Creating a formidable future, One child at a time.
            </div>

            <div className="md:w-[320px] text-sm text-white font-medium mb-4  text-center mx-auto">
              For more info and enquiries about creative kiddies, send us a
              message, or schedule a visit.
            </div>
            <div className="flex items-start flex-col md:flex-row justify-start gap-x-3 mx-auto gap-2">
              {" "}
              <CustomButton
                text="Schedule a visit"
                onClick={goToContact}
                className="md:w-[200px] bg-primary"
              />
              <CustomButton
                text="Send a message"
                onClick={goToContact}
                className="md:w-[200px] bg-transparent text-primary hover:bg-transparent"
              />
            </div>
          </div>
        </div>
        <div className="hidden md:flex px-3 md:px-10 w-full sm:w-4/5 lg:w-1/2 mx-auto py-1 lg:py-2"></div>
      </div>
    </div>
  );
};

export default Hero;
