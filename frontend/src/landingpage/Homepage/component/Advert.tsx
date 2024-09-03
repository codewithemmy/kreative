import { useContext, useEffect, useState } from "react";
import ApiAuth from "../../../api/ApiAuth";
import { Context } from "../../../context/Context";
interface AdvertDetails {
  _id: string;
  title: string;
  content: string;
  image: string;
}

const Advert = () => {
  const { adminAccess } = useContext(Context);
  const [advert, setAdvert] = useState<AdvertDetails[]>([]);

  const handleGetAdvert = async () => {
    try {
      const response = await ApiAuth.get("/notice?noticeType=advert", {
        headers: {
          Authorization: "Bearer " + adminAccess?.userToken,
        },
      });
      setAdvert(response?.data?.notice || []);
    } catch (error) {
      console.error("Error fetching adverts:", error);
    }
  };

  useEffect(() => {
    handleGetAdvert();
  }, []);

  return (
    <div className="grid grid-cols-3 px-4">
      {advert.length > 0 ? (
        advert.map((adverts) => (
          <div key={adverts?._id}>
            {adverts?.image && (
              <div
                style={{
                  width: "300px",
                  height: "300px",
                  backgroundImage: `url(${adverts?.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            )}
          </div>
        ))
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Advert;
