import React from "react";
import Footer from "../Homepage/component/Footer";
import Navbar from "../Homepage/component/Navbar";
import ContactHero from "./ContactHero";
import MapSection from "../Homepage/component/MapSection";
import QuickLinks from "./QuickLinks";


const ContactPage = () => {
  return (
    <div className="">
      <Navbar />
      <ContactHero />
      <MapSection/>
      <QuickLinks/>
      <Footer />
    </div>
  );
};

export default ContactPage;
