import { useEffect } from "react";
import AOS from "aos";

const Branches = () => {
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);
  const branches = [
    {
      branchName: "Mkpolo Branch",
      branchAddress:
        " Creative Kiddies Close Christ the king Estate Mkpolo Off Nelly's Hotel Oba New Road, Oba Anambra State.",
      branchImg:
        "https://img.freepik.com/free-vector/welcome-high-school-university-study-architecture-construction-building-exterior-front_1284-41473.jpg?t=st=1716987527~exp=1716991127~hmac=bec83f832ddc4d2014bf07019a434a3d5049793fc7d437f970fe49013e612817&w=740",
    },
    {
      branchName: "New world Branch",
      branchAddress:
        "2 Creative Kiddies Close New World Estate,Off Chikson fuel station Oba express road, Oba Anambra State.",
      branchImg:
        "https://img.freepik.com/free-vector/welcome-high-school-university-study-architecture-construction-building-exterior-front_1284-41473.jpg?t=st=1716987527~exp=1716991127~hmac=bec83f832ddc4d2014bf07019a434a3d5049793fc7d437f970fe49013e612817&w=740",
    },
    {
      branchName: "Awada Branch",
      branchAddress:
        " 7B Upper Amanofor street Ugwuagba,Off NEPA road Obosi,Anambra State.",
      branchImg:
        "https://img.freepik.com/free-vector/welcome-high-school-university-study-architecture-construction-building-exterior-front_1284-41473.jpg?t=st=1716987527~exp=1716991127~hmac=bec83f832ddc4d2014bf07019a434a3d5049793fc7d437f970fe49013e612817&w=740",
    },
  ];
  return (
    <div className="my-12" data-aos="fade-right">
      <h1 className="text-center text-2xl  md:text-4xl font-bold py-8">
        Our Branches
      </h1>
      <div className="flex items-center flex-col lg:flex-row  justify-between gap-4 px-4">
        {branches.map((branch, index) => (
          <div key={index}>
            <img
              src={branch.branchImg}
              alt={branch.branchName}
              className="w-1/2 mx-auto"
            />
            <h4 className="text-center text-primary py-2 md:text-2xl">
              {branch.branchName}
            </h4>
            <p className="md:w-[90%] md:mx-auto text-sm text-center">
              {branch.branchAddress}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Branches;
