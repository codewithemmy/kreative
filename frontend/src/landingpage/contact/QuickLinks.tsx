import React, { useEffect } from "react";
import AOS from "aos";
import {
  FaEnvelope,
  FaInstagram,
  FaPhone,
  FaTiktok,
  FaTwitter,
} from "react-icons/fa";
import address from "./contactImages/address.svg";
import phone from "./contactImages/phone.svg";

function QuickLinks() {
  const contactCards = [
    {
      imgIcon: <FaEnvelope />,
      contactText: "Email Us",
      link: "mailto:info@afrilish.com",
    },
    {
      imgIcon: <FaPhone />,
      contactText: "Call Us",
      link: "tel:+247537169380",
    },
    {
      imgIcon: <FaTiktok />,
      contactText: "Tiktok",
      link: "https://www.tiktok.com/@afrilish",
    },
    {
      imgIcon: <FaTwitter />,
      contactText: "Twitter",
      link: "https://twitter.com/afrilishuk_",
    },
    {
      imgIcon: <FaInstagram />,
      contactText: "Instagram",
      link: "https://www.instagram.com/afrilish",
    },
  ];

  useEffect(() => {
    AOS.init({ duration: 1000 });
  });

  return (
    <div className="w-full  md:p-8">
      <div className="w-full my-4" data-aos="fade-up">
        <h3 className="w-60 bg-primary font-mono font-bold text-center mx-auto px-2 py-4 rounded-lg text-white text-xl">
          Quick Information
        </h3>
      </div>

      <div className="w-full p-8 mb-10">
        <div className="w-full mx-auto grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 justify-around items-center">
          {contactCards.map((card, index) => (
            <div key={index} className="md:w-28">
              <a
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                data-aos="fade-right"
                className="w-full flex items-center gap-x-2 shadow-xl infocard border border-gray-300 py-4 px-2 rounded-md"
              >
                <div className="contact-icon text-primary rounded-sm">
                  {card.imgIcon}
                </div>
                <h3 className=" text-primary font-bold text-sm">
                  {card.contactText}
                </h3>
              </a>
            </div>
          ))}
        </div>
        <div className="w-full mt-10 pt-[2rem] flex flex-col md:flex-row  md:items-center  justify-between gap-10">
          <div className="flex  items-center justify-start gap-x-3 ">
            <img src={address} className="w-8" />
            <div className="">
              <div className="font-bold text-lg">Adress</div>
              <div className="text-sm">
                Address: N0 16, Community Road, Owode, Salvation, Ajah, Lagos.
              </div>
            </div>
          </div>
          <div className="flex items-center justify-start gap-x-3">
            <img src={phone} className="w-8" />
            <div className="">
              <div className="font-bold text-lg">Contact</div>
              <div className="text-sm">29395060079700</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickLinks;
