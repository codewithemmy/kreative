import React, {
  useState,
  useRef,
  useContext,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import { BiEdit } from "react-icons/bi";
import avatar from "../../../../assets/avartar.jpeg";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import Spinner from "../../../../utilities/Spinner";
import CustomButton from "../../../../customBtn";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
}

function UpdateAccount(): JSX.Element {
  const { access, userDetails, sent, loadUserDetails, setSent } =
    useContext(Context);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string>(
    userDetails?.[0]?.profileImage || avatar
  );
  const { register, handleSubmit, reset, setValue } = useForm<FormData>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.patch(
        `/user/update/${access?.userId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${access?.userToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      reset();
      setIsLoading(false);
      successNotifier("Admin updated successfully!");
    } catch (error: any) {
      setIsLoading(false);
      errorNotifier(error.response.data.message);
    }
  };

  useEffect(() => {
    loadUserDetails();
    setProfileImage(userDetails?.[0]?.profileImage);
  }, [sent]);

  const postPic = (event: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const profilePic = event.target.files?.[0];

    if (profilePic) {
      const formData = new FormData();
      formData.append("image", profilePic);

      ApiAuth.patch(`/user/update/${access?.userId}`, formData, {
        headers: {
          Authorization: `Bearer ${access?.userToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          setIsLoading(false);
          loadUserDetails();
          setSent(!sent);
          successNotifier("Image Uploaded Successfully!");
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error changing profile image:", error);
        });
    }
  };

  return (
    <div className="bg-white p-4 my-8">
      <h1 className="font-semibold text-xl md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl flex flex-grow pb-4">
        Profile
      </h1>
      {isLoading ? (
        <div className="relative">
          <div className="flex items-center gap-x-2 absolute right-2 top-2">
            <Spinner />
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="bg-white md:shadow-md flex flex-col items-center md:items-start md:flex-row p-5 w-full rounded-lg ml-0 mr-auto">
        <div className="w-auto">
          <input
            className="hidden"
            type="file"
            accept="image/*"
            id="picture-profile"
            onChange={postPic}
            ref={fileInputRef}
          />
          <label htmlFor="picture-profile">
            <div className="profile-picture relative">
              <div className="pictures h-40 w-40 bg-[#D9D9D9] rounded-full overflow-hidden">
                <img
                  className="w-full h-full"
                  ref={imgRef}
                  src={profileImage}
                  alt=""
                />
              </div>
              <span className="text-primary text-3xl font-bold absolute left-[70%] md:right-2 top-[70%] bg-white p-1 shadow-sm rounded-md">
                <BiEdit />
              </span>
            </div>
          </label>
        </div>
        <div className="profile-names-description p-6">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-bold">{userDetails?.[0]?.name}</h3>
          </div>
          <p className="mt-2 text-sm font-light">{userDetails?.[0]?.email}</p>
          <div className="flex space-x-5 items-start">
            <div className="total-contract-container grid place-items-center">
              <h4 className="text-gray-500 p-2 text-sm">
                {" "}
                ({access?.accountType})
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div className="py-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col w-full">
              <label
                htmlFor="name"
                className="text-sm text-[#686868] py-2"
              >
                Name
              </label>
              <input
                type="text"
                {...register("name")}
                id="name"
                className="w-full border border-[#7070702E] rounded-md pl-2"
              />
            </div>
            <div className="flex flex-col w-full">
              <label
                htmlFor="email"
                className="text-sm text-[#686868] py-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="w-full border border-[#7070702E] rounded-md pl-2"
              />
            </div>
            <div className="flex flex-col w-full">
              <label
                htmlFor="phoneNumber"
                className="text-sm text-[#686868] py-2"
              >
                Phone no
              </label>
              <input
                type="text"
                id="phoneNumber"
                {...register("phoneNumber")}
                className="w-full border border-[#7070702E] rounded-md pl-2"
              />
            </div>{" "}
          </div>
          <button
            className="bg-primary rounded-3xl cursor-pointer hover:bg-hover mt-8 md:mt-12 px-4 py-2 md:w-[120px] col-span-3 text-white"
            type="submit"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateAccount;
