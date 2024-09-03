import { useEffect, useState } from "react";
import gallery from "../../GalleryPage/gallery.json";
import { Link } from "react-router-dom";

const Gallery = () => {
  interface Image {
    id: number;
    image: string;
  }

  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setImages(gallery);
    }, 2000);
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-col justify-center items-center mb-[40px] p-4 ">
        <div className="w-full text-center text-4xl font-bold  p-2 font-inter ">
          Our Gallery
        </div>
        <div className="w-full sm:w-[380px] text-center text-sm font-medium leading-relaxed ">
          Our gallery includes past experiences our wonderful teachers, students
          and events.
        </div>
        {/* <a href='#'>Learn More</a> */}
      </div>
      <div className="w-full lg:h-[550px] grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2 lg:grid-cols-3 justify-start items-start xl:grid-cols-4">
        {images.map((image: Image) => (
          <div
            key={image.id}
            className="w-full flex items-start hover:scale-105 transition duration-500 transform"
          >
            <img src={image.image} className="w-full rounded-lg" />
          </div>
        ))}
      </div>
      <div className="flex items-end justify-end">
        <Link
          to="/gallery"
          className="text-primary hover:text-white text-sm font-medium border border-primary hover:border-hover hover:bg-hover p-2 rounded-xl mt-4"
        >
          View More
        </Link>
      </div>
    </div>
  );
};

export default Gallery;
