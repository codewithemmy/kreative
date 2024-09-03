import React from "react";
import error from "../assets/error404.jpeg";

function ErrorPage() {
  const goBack = () => {
    window.history.back();
  };
  return (
    <section className="p-12 flex items-center justify-center flex-col">
      <div className="w-full text-center font-sans font-bold text-xl md:text-3xl my-[30px] text-primary">
        Page Not Found
      </div>
      <div className="w-full md:w-[400px] mx-auto">
        <img src={error} alt="error" className="w-full" />
      </div>
      <button
        onClick={goBack}
        className="bg-primary hover:bg-hover mx-auto rounded-full px-3 py-2 mt-[30px] text-white"
      >
        Go Back
      </button>
    </section>
  );
}

export default ErrorPage;
