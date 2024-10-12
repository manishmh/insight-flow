import Image from "next/image";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa6";
import FloatingDivs from "../global/floating-divs";

const Hero = () => {
  return (
    <div className="pt-[100px] px-8 overflow-hidden">
      <div className="flex justify-center items-center text-xs">
        <Link href="/login">
          <div className="border shadow border-gray-400 flex items-center gap-1 group px-4 rounded-full py-1 text-gray-700 cursor-pointer">
            Insight Flow Beta{" "}
            <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </Link>
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl text-center font-medium pt-4 text-[#38322f] md:leading-[50px]">
        Data to <span className="text-blue-700">insights</span>
        <br /> in minutes
      </h1>
      <h2 className="text-center max-w-md mx-auto pt-3 text-gray-500 text-sm md:text-lg">
        Designed to transform raw data into actionable
        <br /> insights for faster decisions
      </h2>
      <div className="flex justify-center pt-4">
        <Link href="/login">
          <button className="bg-[#2f3f5d] text-white px-6 hover:bg-[#3a5077] py-1 rounded-lg transition-colors duration-300">
            Get Started
          </button>
        </Link>
      </div>
      <div className="relative mt-20 rounded-xl max-w-[1100px] mx-auto">
        <div className="absolute inset-0 z-10">
          <FloatingDivs online={true} />
        </div>
        <div className="md:hidden flex justify-center border-b border-gray-300 rounded-xl max-w-[400px] mx-auto">
          <Image
            src="/home/hero-mobile.png"
            alt="hero-image-laptop-desktop"
            width={400}
            height={700}
            className="w-full"
          />
        </div>
        <div className="items-center justify-center hidden md:flex">
          <Image
            src="/home/hero-image.png"
            alt="hero-image-laptop-desktop"
            width={1100}
            height={700}
            quality={100}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
