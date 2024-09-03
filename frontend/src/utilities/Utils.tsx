export function convertPriceToNumber(price: string): number {
  const withoutCommas = price.replace(/,/g, '');
  return parseFloat(withoutCommas);
}

import { AiTwotoneHome } from "react-icons/ai";
import {
  BiCalendar,
  BiCamera,
  BiDotsHorizontal,
  BiDotsVertical,
  BiLogOut,
  BiMessage,
  BiMessageError,
  BiPlusCircle,
  BiSearch,
  BiSpeaker,
  BiStar,
  BiUser,
  BiUserCircle,
} from "react-icons/bi";
import {
  FaBookOpen,
  FaChartLine,
  FaEye,
  FaHome,
  FaPenSquare,
  FaPencilAlt,
  FaPercent,
  FaTasks,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { GiPaperBagFolded } from "react-icons/gi";
import { IoNotifications } from "react-icons/io5";
import helmetDude from "../assets/blog/helmet-guy.svg";
import {
  HiSpeakerphone,
  HiLocationMarker,
  HiUser,
  HiOutlineSpeakerphone,
  HiQuestionMarkCircle,
} from "react-icons/hi";
import { IoMdOptions, IoMdSettings, IoMdStarOutline } from "react-icons/io";
import bell from "../assets/bell-notification.svg";
import camera from "../assets/rounded-camera.svg";
import campImg from "../assets/interiorDecorator.svg";
import cleaning from "../assets/cleaning.svg";
import logo from "../assets/creativeLogo.svg";
import mobile from "../assets/sidebar-scan.svg";
import notification from "../assets/notification.svg";
import service from "../assets/service-img.svg";
import ayeola from "../assets/ayeola.svg";
import {
  RiArrowDropDownLine,
  RiArrowDropUpLine,
  RiCommunityFill,
  RiSettings2Fill,
  RiStarFill,
} from "react-icons/ri";
import { FcSettings } from "react-icons/fc";
import { GrMoney, GrSettingsOption } from "react-icons/gr";

import { BsEye, BsStarFill } from "react-icons/bs";
import { RiMessageLine } from "react-icons/ri";
// blog assets
import crowbarLady from '../assets/blog/crowbar-lady.svg'
import overallLady from '../assets/blog/overall-lady.svg'

// Image and Icon export
export const appStore = mobile;
export const bellNotify = bell;
export const creative_logo = logo;
export const circleUser = BiUserCircle;
export const revenue = GrMoney;
export const eye = FaEye;
export const home = AiTwotoneHome;
export const settings = IoMdSettings;
export const location = HiLocationMarker;
export const logout = BiLogOut;
export const message = BiMessage;
export const messageLine = RiMessageLine;
export const msgAlert = BiMessageError;
export const notify = notification;
export const notifyBell = IoNotifications;
export const pen = FaPencilAlt;
export const search = BiSearch;
export const speaker = HiSpeakerphone;
export const speakerLine = HiOutlineSpeakerphone;
export const star = BiStar;
export const tasks = FaTasks;
export const user = HiUser;
export const users = FaUsers;


// Campaigns Cards
export const campaignsCardSuper = [
  {
    top: "Total Campaings",
    greenIcon: GiPaperBagFolded,
    greenNumber: "600",
  },
  {
    top: "Total Engagements",
    greenIcon: FaChartLine,
    greenNumber: "3024",
  },
  {
    top: "Engagement Rate",
    greenIcon: FaPercent,
    greenNumber: "68%",
  },
  {
    top: "New Campaign?",
    greenIcon: BiPlusCircle,
    greenNumber: "Create Campaign",
  },
];

// Second Campaigns Card
export const dashSupercampaigns = [
  {
    img: campImg,
    tag: "Tag",
    tag1: "Tag",
    tag2: "Tag",
    campaignName: "Name of Campaign",
    description: "Description of campaign maximum of 200 characters",
    buttonText: "View Campaign",
    optionIcon: BiDotsHorizontal,
  },
  {
    img: campImg,
    tag: "Tag",
    tag1: "Tag",
    tag2: "Tag",
    campaignName: "Name of Campaign",
    description: "Description of campaign maximum of 200 characters",
    buttonText: "View Campaign",
    optionIcon: BiDotsHorizontal,
  },
  {
    img: campImg,
    tag: "Tag",
    tag1: "Tag",
    tag2: "Tag",
    campaignName: "Name of Campaign",
    description: "Description of campaign maximum of 200 characters",
    buttonText: "View Campaign",
    optionIcon: BiDotsHorizontal,
  },
  {
    img: campImg,
    tag: "Tag",
    tag1: "Tag",
    tag2: "Tag",
    campaignName: "Name of Campaign",
    description: "Description of campaign maximum of 200 characters",
    buttonText: "View Campaign",
    optionIcon: BiDotsHorizontal,
  },
  {
    img: campImg,
    tag: "Tag",
    tag1: "Tag",
    tag2: "Tag",
    campaignName: "Name of Campaign",
    description: "Description of campaign maximum of 200 characters",
    buttonText: "View Campaign",
    optionIcon: BiDotsHorizontal,
  },
];

// City Builder Objects
export const builderCards = [
  {
    icon: eye,
    top: "Page visits",
    bold: "20",
  },
  {
    icon: users,
    top: "Contract",
    bold: "01",
  },
  {
    icon: star,
    top: "Reviews",
    bold: "03",
  },
];

export const marketerCards = [
  {
    icon: users,
    top: "Referrals",
    bold: "20",
  },
  {
    icon: star,
    top: "Click rating",
    bold: "10%",
  },
];

export const getStarted = [
  {
    image: camera,
    title: "Complete Profile",
    text: "Add your name, skills, contact and location to let your clients know more about you!",
    btnIcon: FaPenSquare,
    btnText: "Edit Profile",
  },
  {
    image: camera,
    title: "Showcase Yourself",
    text: "Add pictures and videos of your featured past works!",
    btnIcon: BiCamera,
    btnText: "Edit Upload Media",
  },
];

export const builderHelpCenter = [
  {
    icons: HiQuestionMarkCircle,
    title: "FAQ",
  },
  {
    icons: FaBookOpen,
    title: "Guides",
  },
  {
    icons: RiCommunityFill,
    title: "Community",
  },
];

export const buildQuestions = [
  {
    question: "How do I sign up as a user on CityFi?",
    answer: "Ask Google",
    drop: RiArrowDropDownLine,
    up: RiArrowDropUpLine,
  },
  {
    question: "What services are available on CityFi?",
    answer: "Ask Google",
    drop: RiArrowDropDownLine,
    up: RiArrowDropUpLine,
  },
  {
    question: "How do I find and hire a service provider on CityFi?",
    answer: "Google knows best",
    drop: RiArrowDropDownLine,
    up: RiArrowDropUpLine,
  },
  {
    question:
      "What are the fees and charges for using CityFi as a user or service provider?",
    answer: "Google knows best",
    drop: RiArrowDropDownLine,
    up: RiArrowDropUpLine,
  },
  {
    question:
      "How does CityFi ensure the quality and safety of service providers?",
    answer: "Google knows best",
    drop: RiArrowDropDownLine,
    up: RiArrowDropUpLine,
  },
];

// Marketer Sidebar Links
export const sidebarMarketer = [
  {
    link: "Home",
    icon: FaHome,
  },
  {
    link: "Search",
    icon: BiSearch,
  },
  {
    link: "Profile",
    icon: FaUser,
  },
  {
    link: "Settings",
    icon: RiSettings2Fill,
  },
];

export const loadFromLocalStorage = (key: string) => {
  try {
    const contextData = localStorage.getItem(key);
    return contextData ? JSON.parse(contextData) : null;
  } catch (error) {
    console.error(`Error loading data from localStorage: ${error}`);
    return null;
  }
};

export const saveToLocalStorage = (key: string, data: any) => {
  try {
    const contextData = JSON.stringify(data);
    localStorage.setItem(key, contextData);
  } catch (error) {
    console.error(`Error saving data to localStorage: ${error}`);
  }
};

export const clearLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing data from localStorage: ${error}`);
  }
};

export const truncateMessage = (message: string, maxLength: number) => {
  if (message.length > maxLength) {
    return message.substring(0, maxLength) + "...";
  }
  return message;
};

export const adminReviews = [
  {
    icon: BsStarFill,
    top: 'Total Review',
    bold: 10,
  },
  {
    icon: BsStarFill,
    top: 'Average Rated',
    bold: 4.5,
  },
];

const truncateText = (text: string | undefined, maxLength: number) => {
  if (text?.length && text.length <= maxLength) {
    return text;
  }
  return text?.slice(0, maxLength) + '...';
};

export const shortenedText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
};

export const text = 'In a world increasingly dominated by mass-produced goods, there\'s something profoundly special about the art of artisan craftsmanship. Artisans are the guardians of tradition, the stewards of culture, and the creators of objects that speak to the soul. In this blog, we embark on a journey to celebrate the world of artisans, exploring the timeless beauty of their craft and the stories that breathe life into their creations. \n Artisans are masters of their crafts, be it woodworking, ceramics, jewelry-making, or any other discipline. Their workshops are hallowed grounds where raw materials are transformed into pieces of art. Each workbench holds a story, and every tool in their hands becomes an extension of their creativity. \n In a world of uniformity, artisans bring a touch of the unique and the imperfect. Their creations bear the marks of individuality, telling a story of the human hand and heart. Discover why imperfection is not a flaw but a hallmark of artisanal beauty. \n Artisans often draw from age-old traditions and techniques passed down through generations. They are the torchbearers of cultural heritage, breathing new life into ancient crafts and ensuring that traditions endure in a rapidly changing world.';
const truncatedText = truncateText(text, 500);

export const texts = [
  `In a world increasingly dominated by mass-produced goods, there\'s something profoundly special about the art of artisan craftsmanship. Artisans are the guardians of tradition, the stewards of culture, and the creators of objects that speak to the soul. In this blog, we embark on a journey to celebrate the world of artisans, exploring the timeless beauty of their craft and the stories that breathe life into their creations. \n Artisans are masters of their crafts, be it woodworking, ceramics, jewelry-making, or any other discipline. Their workshops are hallowed grounds where raw materials are transformed into pieces of art. Each workbench holds a story, and every tool in their hands becomes an extension of their creativity. \n In a world of uniformity, artisans bring a touch of the unique and the imperfect. Their creations bear the marks of individuality, telling a story of the human hand and heart. Discover why imperfection is not a flaw but a hallmark of artisanal beauty. \n Artisans often draw from age-old traditions and techniques passed down through generations. They are the torchbearers of cultural heritage, breathing new life into ancient crafts and ensuring that traditions endure in a rapidly changing world.`,
  `In a world increasingly dominated by mass-produced goods, there\'s something profoundly special about the art of artisan craftsmanship. Artisans are the guardians of tradition, the stewards of culture, and the creators of objects that speak to the soul. In this blog, we embark on a journey to celebrate the world of artisans, exploring the timeless beauty of their craft and the stories that breathe life into their creations. \n Artisans are masters of their crafts, be it woodworking, ceramics, jewelry-making, or any other discipline. Their workshops are hallowed grounds where raw materials are transformed into pieces of art. Each workbench holds a story, and every tool in their hands becomes an extension of their creativity. \n In a world of uniformity, artisans bring a touch of the unique and the imperfect. Their creations bear the marks of individuality, telling a story of the human hand and heart. Discover why imperfection is not a flaw but a hallmark of artisanal beauty. \n Artisans often draw from age-old traditions and techniques passed down through generations. They are the torchbearers of cultural heritage, breathing new life into ancient crafts and ensuring that traditions endure in a rapidly changing world.`,
]

const truncatedPost = texts?.map( (text) => truncateText(text, 450))



export const blogFrequent = [
  {
    heading: 'Celebrating the Art of Artisanship: Craftsmanship That Inspires',
    img: helmetDude,
    blogText: truncatedText,
  }
]

export const oldPosts = [
  {
    img: overallLady,
    heading: 'Connecting with Tradition: Artisans as Culture Keepers',
    oldTexts: truncatedPost[0],
  },
  {
    img: crowbarLady,
    heading: 'Artisan and Client: A Collaborative Journey',
    oldTexts: truncatedPost[1],
  }
]