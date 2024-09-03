import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import gallery from "./gallery.json";
import Footer from "../../landingpage/Homepage/component/Footer";
import Navbar from "../../landingpage/Homepage/component/Navbar";
import Pagination from "../../utilities/Pagination";

const GalleryPage = () => {
  interface Image {
    id: number;
    image: string;
  }

  const [images, setImages] = useState<Image[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0); // Set initial index to 0
  const itemsPerPage = 12;

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  useEffect(() => {
    setTimeout(() => {
      setImages(gallery);
    }, 2000);
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-4">
        <div className="flex flex-col justify-center items-center mb-[40px] p-4">
          <div className="w-full text-center text-4xl font-bold p-2 font-inter">
            Our Gallery
          </div>
          <div className="w-full sm:w-[380px] text-center text-sm font-medium leading-relaxed">
            Our gallery includes past experiences our wonderful teachers,
            students and events.
          </div>
        </div>

        <div className="w-full mb-8 relative">
          <Carousel
            selectedItem={selectedImageIndex}
            onChange={setSelectedImageIndex}
            showThumbs={false}
            showArrows={true}
            infiniteLoop={true}
            showIndicators={false} // Disable dots
            renderArrowPrev={(clickHandler, hasPrev) =>
              hasPrev && (
                <button
                  type="button"
                  onClick={clickHandler}
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center z-10"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )
            }
            renderArrowNext={(clickHandler, hasNext) =>
              hasNext && (
                <button
                  type="button"
                  onClick={clickHandler}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center z-10"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )
            }
          >
            {images.map((image, index) => (
              <div key={index} className="flex justify-center items-center">
                <img
                  src={image.image}
                  alt={`Carousel image ${index + 1}`}
                  className="max-h-[700px] object-cover rounded-lg"
                />
              </div>
            ))}
          </Carousel>
        </div>

        <div className="w-full grid grid-cols-5 gap-x-4 gap-y-3 justify-start items-start">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="w-full flex items-start lg:hover:scale-105 transition duration-500 transform cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              <img
                src={image.image}
                className="w-full rounded-lg"
                alt={`Gallery image ${index + 1}`}
              />
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          noPerPage={itemsPerPage}
          total={images.length}
          paginate={paginate}
          pageName="Gallery Images"
        />
      </div>
      <Footer />
    </>
  );
};

export default GalleryPage;
