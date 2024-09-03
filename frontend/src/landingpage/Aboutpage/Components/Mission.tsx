import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import icon from "../../Homepage/Homeimages/subjectIcon.svg";

const Mission = () => {
  useEffect(() => {
    AOS.init({ duration: 1500 });
  }, []);

  const statements = [
    {
      id: 1,
      image: icon,
      name: "Mission",
      role: "Creative Kiddies Academy is committed to providing a nurturing and enriching educational environment where children thrive. We believe that every child has the potential to succeed, and we are dedicated to helping them reach their full potential. We offer a comprehensive curriculum that focuses on functional education, guided learning, and skill development. We also foster innovation, creativity, and strong values in our students",
    },
    {
      id: 2,
      image: icon,
      name: "Vision",
      role: "We envision a generation of well-equipped and morally sound individuals who are empowered to excel in life and contribute positively to society. We believe that education is the key to unlocking human potential, and we are committed to providing our students with the tools and resources they need to succeed.",
    },
    {
      id: 3,
      image: icon,
      name: "Core values",
      role: "At Creative Kiddies Academy, we believe that all children deserve a quality education that will prepare them for success in the real world. We provide students with the functional skills they need to thrive in a rapidly changing society, while also fostering their creativity, innovation, and problem-solving abilities. We believe that every child has the potential to succeed, and we are committed to helping them reach their full potential.",
    },
  ];

  return (
    <div data-aos="fade-right">
      <div className="w-full py-10">
        <div className="w-full p-2">
          <div className="md:w-[400px] mx-auto text-center text-2xl md:text-4xl font-bold py-4 mb-[45px] font-inter ">
            Our mission, vision and core values.
          </div>
          <div className="w-full flex gap-6 items-center justify-center flex-col md:flex-row  flex-wrap">
            {statements.map((each) => (
              <div
                key={each.id}
                className=" w-[300px]  md:w-[400px] h-full md:h-[400px] flex items-start rounded-3xl shadow-xl  border border-gray-30  justify-center p-4 pt-10"
              >
                <div className="py-1 w-4">
                  <img src={each.image} className="" />
                </div>
                <div className="w-[320px] ">
                  <div className="w-full font-bold text-xl mb-3 ">
                    {each.name}
                  </div>
                  <div className="text-sm w-full text-justify leading-relaxed">
                    {each.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
