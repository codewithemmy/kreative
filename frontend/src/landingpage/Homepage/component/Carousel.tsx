import React, { useState, useEffect } from "react";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";
import Line from "../../assets/line.png";
import AOS from "aos";
import img1 from "../../assets/whychose1.png";
import img2 from "../../assets/whychose2.png";
import img3 from "../../assets/whychose3.png";
import "aos/dist/aos.css";
import "../css/carousel.css";

const Carousel = () => {
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  const images = [
    {
      id: 1,
      src: img1,
      alt: "Plumbing Service",
      text: "CityFix offers top-notch plumbing services for all your residential and commercial needs. Our expert plumbers ensure that your pipes and fixtures are in perfect working condition.",
    },
    {
      id: 2,
      src: img2,
      alt: "Electric Wiring Service",
      text: "At CityFix, we specialize in professional electric wiring services. Our skilled electricians handle everything from installations to repairs, ensuring the safety and efficiency of your electrical systems.",
    },
    {
      id: 3,
      src: img3,
      alt: "Carpentry Service",
      text: "Need reliable carpentry services? Look no further! CityFix's carpenters are well-equipped to handle all your woodworking projects, delivering precision and quality every time.",
    },
    {
      id: 4,
      src: img1,
      alt: "AC Repairs Service",
      text: "Stay cool and comfortable with CityFix's AC repairs service. Our technicians are experienced in diagnosing and fixing a wide range of air conditioning issues, ensuring your AC unit operates at its best.",
    },
    {
      id: 5,
      src: img2,
      alt: "Solar Installations Service",
      text: "Embrace renewable energy with CityFix's solar installations service. Our team of experts will set up solar panels efficiently, reducing your carbon footprint while saving on energy bills.",
    },
    {
      id: 6,
      src: img3,
      alt: "General Repair Service",
      text: "CityFix also provides a comprehensive general repair service, catering to various maintenance needs. Our skilled team can handle diverse tasks to keep your property in excellent condition.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleImages, setVisibleImages] = useState(3);
  const [hovering, setHovering] = useState<number | null>(null);


  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 900) {
        setVisibleImages(3);
      } else if (screenWidth >= 748) {
        setVisibleImages(1);
      } else {
        setVisibleImages(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => {
      clearInterval(slideInterval);
    };
  }, [images.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <>
      <div className="p-6 py-10 w-full my-4 flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center mt-4 mb-12">
          <img src={Line} alt="" className="my-4" />
          <h2 className="font-extrabold text-4xl text-[#076059] py-2">
            CityFix <span className="text-black">Services</span>{" "}
          </h2>
        </div>

        <div
          className="w-full flex items-center justify-center mb-4 md:mb-6 lg:mb-8"
          data-aos="flip-left"
        >
          <div className="w-full flex justify-center gap-x-2 items-center md:px-4 relative">
            <IoCaretBack
              className="cursor-pointer z-10 w-10 h-10 md:w-20 md:h-20 absolute left-0 md:left-28  text-primary hover:bg-hover hover:text-white rounded-full p-1"
              onClick={handlePrev}
            />
            <div className="mx-auto w-full md:w-[65%] rounded-lg">
              {images?.map((image, index) => {
                const imageSrc = image?.src;
                return (
                  <div
                    className="relative"
                    key={image?.id}
                    onMouseEnter={() => setHovering(index)}
                    onMouseLeave={() => setHovering(null)}
                  >
                    <img
                      src={imageSrc}
                      alt={image.alt}
                      className={`w-full h-full mx-auto ${
                        index === currentIndex ? "fade-in-out" : "hidden"
                      }`}
                      style={{
                        marginLeft:
                          index === 0 && currentIndex === images.length - 1
                            ? "-100%"
                            : "",
                        marginRight:
                          index === images.length - 1 && currentIndex === 0
                            ? "-100%"
                            : "",
                      }}
                    />
                    {hovering === index && (
                      <div className="rounded-xl absolute top-0 left-0 w-full h-full flex items-center px-10 pt-20 justify-end bg-black bg-opacity-25 text-white">
                        <div className="w-[40%]">
                          <div className="w-full font-bold text-2xl mb-2 text-gray-100">
                            {image.alt}
                          </div>
                          <div className="w-full text-sm text-justify">
                            {image.text}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <IoCaretForward
              className="cursor-pointer z-10 w-10 h-10 md:w-20 md:h-20 absolute right-0 md:right-28 text-primary hover:bg-hover hover:text-white rounded-full p-1"
              onClick={handleNext}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Carousel;
