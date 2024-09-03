import React, { useState, useEffect } from "react";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
// import Line from "../../assets/line.png";
// import CustomButton from "../../../utilities/CustomButton";
import AOS from "aos";
import tm1 from "../Homeimages/tm1.jpg";
import tm2 from "../Homeimages/tm2.jpg";
import tm3 from "../Homeimages/tm3.jpg";
import tm4 from "../Homeimages/tm4.jpg";
import tm5 from "../Homeimages/tm5.jpg";
import tm6 from "../Homeimages/tm6.jpg";
import tm7 from "../Homeimages/tm7.jpg";
import tm8 from "../Homeimages/tm8.jpg";
import "aos/dist/aos.css";
import "../css/testimony.css";

const Testimony = () => {
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  const testimonies = [
    {
      id: 1,
      src: tm1,
      message:
        "Lorem ipsum dolor sit amet. Et velit iure aut laboriosam error et accusantium veritatis Ut aliquid obcaecati deleniti nihil hic atque quia et quidem deleniti vel possimus minima",
      userName: "John Smith",
    },
    {
      id: 2,
      src: tm2,
      message:
        "Lorem ipsum dolor sit amet. Et velit iure aut laboriosam error et accusantium veritatis Ut aliquid obcaecati deleniti nihil hic atque quia et quidem deleniti vel possimus minima",
      userName: "Alice Johnson",
    },
    {
      id: 3,
      src: tm3,
      message:
        "Lorem ipsum dolor sit amet. Et velit iure aut laboriosam error et accusantium veritatis Ut aliquid obcaecati deleniti nihil hic atque quia et quidem deleniti vel possimus minima",
      userName: "Michael Chen",
    },
    {
      id: 4,
      src: tm4,
      message:
        "Lorem ipsum dolor sit amet. Et velit iure aut laboriosam error et accusantium veritatis Ut aliquid obcaecati deleniti nihil hic atque quia et quidem deleniti vel possimus minima",
      userName: "Emily Lee",
    },
    {
      id: 5,
      src: tm5,
      message:
        "Lorem ipsum dolor sit amet. Et velit iure aut laboriosam error et accusantium veritatis Ut aliquid obcaecati deleniti nihil hic atque quia et quidem deleniti vel possimus minima",
      userName: "David Williams",
    },
    {
      id: 6,
      src: tm6,
      message:
        "Lorem ipsum dolor sit amet. Et velit iure aut laboriosam error et accusantium veritatis Ut aliquid obcaecati deleniti nihil hic atque quia et quidem deleniti vel possimus minima",
      userName: "Sophia Brown",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibletestimonies, setVisibletestimonies] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 900) {
        setVisibletestimonies(3);
      } else if (screenWidth >= 748) {
        setVisibletestimonies(1);
      } else {
        setVisibletestimonies(1);
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
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonies.length);
    }, 5000);

    return () => {
      clearInterval(slideInterval);
    };
  }, [testimonies.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonies.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonies.length);
  };

  return (
    <>
       <div className="p-6 testimony h-full py-10 w-full my-4 flex flex-col justify-betwwen bg-gray-500  bg-opacity-20 gap-y-10 items-center">
        <div className="w-full text-center text-4xl font-bold  p-2 font-inter ">
          What People Say About Us
        </div>

        <div
          className="w-full flex items-center justify-center mb-4 md:mb-6 lg:mb-8 md:p-10"
          data-aos="flip-left"
        >
          <div className="w-full flex justify-center gap-x-2 items-center px-6 md:px-10 relative">
            <RiArrowLeftLine
              className="cursor-pointer z-10 absolute left-0 md:left-20 w-6 h-6 md:w-10 md:h-10  text-primary hover:bg-hover hover:text-white rounded-full p-1"
              onClick={handlePrev}
            />
            <div className="mx-auto w-full lg:w-[70%] flex flex-row gap-x-6 overflow-hidden">
              {testimonies.map((testimony, index) => {
                return (
                  <div
                    key={index}
                    className={`w-full md:w-2/5 mx-auto bg-gray-200 rounded-xl p-4 ${
                      index === currentIndex ? "fade-in-out" : "hidden"
                    }`}
                    style={{
                      marginLeft:
                        index === 0 && currentIndex === testimonies.length - 1
                          ? "-100%"
                          : "",
                      marginRight:
                        index === testimonies.length - 1 && currentIndex === 0
                          ? "-100%"
                          : "",
                    }}
                  >
                    <div className="w-full flex items-center justify-start gap-x-3 mb-4">
                      <div className="w-12 h-12 bg-primary p-1/2 flex items-center justify-center rounded-full overflow-hidden">
                        <img
                          src={testimony.src}
                          alt={`Image ${testimony.userName}`}
                          className="rounded-full w-full h-full"
                        />
                      </div>
                      <div className="text-md font-semibold ">
                        {testimony.userName}
                      </div>
                    </div>
                    <div className="text-sm text-primary text-justify hover:text-hover mb-2">
                      {testimony.message}
                    </div>
                  </div>
                );
              })}
            </div>
            <RiArrowRightLine
              className="cursor-pointer z-10 absolute right-0 md:right-20 w-6 h-6 md:w-10 md:h-10 text-primary hover:bg-hover hover:text-white rounded-full p-1"
              onClick={handleNext}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimony;
