import { useState } from "react";
import tm1 from "../Aboutimages/tm1.jpg";
import tm2 from "../Aboutimages/tm2.jpg";
import tm3 from "../Aboutimages/tm3.jpg";
import tm4 from "../Aboutimages/tm4.jpg";
import tm5 from "../Aboutimages/tm5.jpg";
import tm6 from "../Aboutimages/tm6.jpg";
import tm7 from "../Aboutimages/tm7.jpg";
import tm8 from "../Aboutimages/tm8.jpg";

const Team = () => {
  const [card, setCard] = useState([
    {
      id: 1,
      image: tm1,
      name: "Brendan Xure",
      role: "Mathematics Tutor",
    },
    {
      id: 2,
      image: tm2,
      name: "Alakz Amara",
      role: "English Tutor",
    },
    {
      id: 3,
      image: tm3,
      name: "Oyindamola Balogun",
      role: "Literature Tutor",
    },
    {
      id: 4,
      image: tm4,
      name: "Afunwa Paschal",
      role: "Geography Tutor",
    },
    {
      id: 5,
      image: tm5,
      name: "Ayubz Rambayi",
      role: "Documentary Tutor",
    },
    {
      id: 6,
      image: tm6,
      name: "Harribaba Umilz",
      role: "Admin",
    },
    {
      id: 7,
      image: tm7,
      name: "Ambee Zidos",
      role: "Accountant",
    },
    {
      id: 8,
      image: tm8,
      name: "Asogwa Casper",
      role: "Art Tutor",
    },
  ]);
  return (
    <div data-aos="fade-right" className="w-full p-8  ">
      <div className="w-full p-2">
        <div className="md:w-[400px] mx-auto text-center text-2xl md:text-4xl font-bold py-4 mb-[45px] font-inter ">
          Meet the people behind Creative Kiddies
        </div>
        <div className="flex gap-6 items-center justify-center flex-wrap flex-shrink-0">
          {card.map((eachcard) => (
            <div className="w-[300px] flex flex-col justify-center items-center ">
              <div className="rounded-full w-[260px] h-[260px] ">
                <img
                  src={eachcard.image}
                  className="rounded-full w-full h-full "
                />
              </div>
              <div className="text-xl font-semibold">{eachcard.name}</div>
              <div>{eachcard.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
