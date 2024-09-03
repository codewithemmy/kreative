import Categories from "./component/Categories";
import Footer from "./component/Footer";
import Testimony from "./component/Testimony";
import Navbar from "./component/Navbar";
import Hero from "./component/Hero";
import Gallery from "./component/Gallery";
import FaqsPage from "./component/Fags";
import MapSection from "./component/MapSection";
import Branches from "./component/Branches";
import Advert from "./component/Advert";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Categories />
      <Advert />
      <Gallery />
      <Testimony />
      <Branches />
      <MapSection />
      <FaqsPage />
      <Footer />
    </div>
  );
};

export default HomePage;
