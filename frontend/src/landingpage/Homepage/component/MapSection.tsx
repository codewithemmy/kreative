import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function MapSection() {
  useEffect(() => {
    AOS.init({ duration: 1500 });
  }, []);

  const customMapStyle = [
    {
      featureType: "all",
      elementType: "all",
      stylers: [
        {
          saturation: -100,
        },
        {
          lightness: 0,
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "all",
      stylers: [
        {
          visibility: "simplified",
        },
      ],
    },
  ];

  const encodedMapStyle = encodeURIComponent(JSON.stringify(customMapStyle));

  return (
    <div data-aos="fade-right" className="w-full  md:p-10" id="contact">
      <div className="w-full flex items-center flex-col justify-center sm:mt-[30px] sm:mb-[15px]">
        <p className="text-4xl font-semibold font-Syne-medium leading-relaxed text-black text-center w-full md:w-2/4 sm:px-6 mt-[2rem] sm:mb-3">
          Reach out to us
        </p>
        <p className="font-Syne-bold text-xl text-primary text-center w-full md:w-2/4 sm:px-6 mb-2">
          We typically respond within 24hrs
        </p>
      </div>
      <div className="w-full flex flex-col lg:flex-row items-center ">
        <form
          className="w-full px-6 sm:px-16 sm:pt-12"
          data-aos="fade-right"
          // onSubmit={handleSubmit(submitForm)}
        >
          <div className="w-full text-2xl font-bold  py-2 font-inter ">
            Contact Form
          </div>
          <div className="w-full flex flex-col items-center justify-center mb-3">
            <div className="form-group flex  items-center border-b border-primary sm:mx-16 w-full mb-3">
              <label
                className="block py-3 pr-2 text-xs  w-[90px] md:w-[79px] lg:w-[85px] "
                htmlFor="email"
              >
                Full name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="name"
                className="block border-none w-full text-xs bg-transparent shadow-none outline-none"
                // {...register("name", {
                //   required: true,
                // })}
              />
            </div>
            {/* {errors.name?.type === "required" && (
            <p className="text-red-500 text-xs italic">
              Full name is required
            </p>
          )} */}

            <div className="form-group flex items-center border-b border-primary sm:mx-16 w-full">
              <label
                className=" py-3  text-xs w-[130px] sm:w-[120px] md:w-[117px] lg:w-[120px] flex items-center gap-1"
                htmlFor="email"
              >
                Phone number <p className="">*</p>
              </label>
              <input
                type="text"
                id="phonenumber"
                className="block border-none w-full text-xs bg-transparent shadow-none outline-none"
                // {...register("phoneNumber", {
                //   required: true,
                // })}
              />
            </div>
            {/* {errors.phoneNumber?.type === "required" && (
            <p className="text-red-500 text-xs italic">
              Phone number is required
            </p>
          )} */}
          </div>

          <div className="w-full flex flex-col items-center justify-center mb-3">
            <div className="form-group flex items-center border-b border-primary sm:mx-16 w-full mb-3">
              <label
                className="block py-3 pr-2 text-xs w-[55px] md:w-[50px] lg:w-[52px]"
                htmlFor="email"
              >
                Email <span className="asterisk">*</span>
              </label>
              <input
                type="email"
                id="email"
                className="block border-none w-full text-xs bg-transparent shadow-none outline-none"
                // {...register("email", {
                //   required: true,
                // })}
              />
            </div>
            {/* {errors.email?.type === "required" && (
            <p className="text-red-500 text-xs italic">
              Email is required
            </p>
          )} */}
            <div className="form-group flex items-center border-b border-primary sm:mx-16 w-full">
              <label
                className="block py-3 pr-2 text-xs w-[70px]  md:w-[63px] lg:w-[70px]"
                htmlFor="email"
              >
                Subject <span className="asterisk">*</span>
              </label>
              <input
                type="text"
                id="subject"
                className="block border-none w-full text-xs bg-transparent shadow-none outline-none"
                // {...register("subject", {
                //   required: false,
                // })}
              />
            </div>
          </div>
          <div className="w-full flex flex-col items-center justify-center">
            <div className="form-group flex items-center border-b border-primary sm:mx-16 w-full">
              <label
                className="block py-3 pr-2 text-xs w-[85px] md:w-[74px] lg:w-[80px]"
                htmlFor="email"
              >
                Message <span className="asterisk">*</span>
              </label>
              <textarea
                id="message"
                className="block w-full border-none pt-3 mt-2 text-xs bg-transparent shadow-none outline-none"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className={`py-3 mt-[50px] px-5  border-primary border-2 bg-primary text-center text-white text-md font-semibold rounded-xl hover:bg-white hover:text-primary hover:border-primary focus:outline-none`}
          >
            Submit
          </button>
        </form>
        <div
          style={{ color: "black" }}
          className="w-full h-[400px] lg:h-[550px] p-8  mt-8"
          data-aos="fade-right"
        >
          <iframe
            className="rounded-2xl w-full h-full"
            id="gmap_canvas"
            src={`https://maps.google.com/maps?q=anambra,oba&t=&z=10&ie=UTF8&iwloc=&output=embed&mapstyle=${encodedMapStyle}`}
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default MapSection;
