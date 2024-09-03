import React from "react";
import Footer from "../Homepage/component/Footer";
import Navbar from "../Homepage/component/Navbar";
import Team from "./Components/Team";
import AboutHero from "./Components/AboutHero";
import Mission from "./Components/Mission";
import WhatWeDo from "./Components/WhatWeDo";

const About = () => {
  return (
    <div className="About">
      <Navbar />
      <AboutHero />
      <Team />
      <Mission />
      <WhatWeDo />
      <Footer />
    </div>
  );
};

export default About;
