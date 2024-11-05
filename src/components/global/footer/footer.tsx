import { FooterData } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { RiLoginCircleFill } from "react-icons/ri";
import { SiAlwaysdata } from "react-icons/si";
import SlidingButton from "../ui/sliding-window";

const Footer = () => {
  return (
    <div className="p-1">
      <div className="bg-[#1f2a3e] rounded-[30px] flex flex-col items-center pt-24 overflow-hidden">
        <div className="rounded-2xl p-2 bg-[#e1e8ee] shadow-md shadow-[#4a7498]">
          <Image
            src="/logo2-nodesc.png"
            alt="footer-logo"
            width={80}
            height={80}
          />
        </div>
        <div className="my-12 flex flex-col items-center gap-4 text-[#FBFAF9]">
          <div className="flex text-sm items-center gap-2 px-4 py-1 bg-[#0b0f15] rounded-full bg-opacity-50 shadow-sm shadow-[#21293a]">
            <SiAlwaysdata /> See data differently
          </div>
          <div className="text-center text-4xl md:text-5xl font-medium">
            Analyze. Visualize. <br /> Collaborate.
          </div>
          <div className="text-center px-4 text-gray-400">
            The collaborative platform for business analytics.
          </div>
          <SlidingButton
            content="Get started - for free"
            bg="bg-white"
            logo={<RiLoginCircleFill />}
            link="/auth/login"
          />
        </div>

        <div className="bg-[#151d2b] w-full mt-8 text-[#FBFAF9] px-4 py-16 md:text-sm">
          <div className="flex justify-between max-w-screen-lg mx-auto gap-10 flex-col md:flex-row">
            <div className="space-y-10 flex-shrink-0">
              <div className="font-semibold flex items-center gap-2">
                <div className="bg-[#e1e8ee] rounded-sm ">
                  <Image
                    src="/logo2-nodesc.png"
                    alt="footer-logo-2"
                    width={30}
                    height={30}
                  />
                </div>
                Insight flow
              </div>
              <div className="text-gray-300">
                built from scratch - Powered by data.{" "}
              </div>
              <div className="flex gap-2 items-center">
                Source |{" "}
                <div className="text-gray-400">
                  <Link href={"https://index.app/beta"}>necarti</Link>
                </div>
              </div>
            </div>
            <div className="flex gap-4 md:gap-10 w-full justify-evenly flex-wrap">
              <div className="text-[#FBFAF9] flex flex-col gap-4">
                <div className="text-gray-400">Features</div>
                {FooterData[0].map((features, index) => (
                  <Link href={features.link} key={index}>
                    <div
                      className="hover:text-gray-300 transition-colors duration-300"
                      key={index}
                    >
                      {features.name}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-[#FBFAF9] flex flex-col gap-4">
                <div className="text-gray-400">Company</div>
                {FooterData[1].map((features, index) => (
                  <Link href={features.link} key={index}>
                    <div
                      className="hover:text-gray-300 transition-colors duration-300"
                      key={index}
                    >
                      {features.name}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-[#FBFAF9] flex flex-col gap-4">
                <div className="text-gray-400">Resources</div>
                {FooterData[2].map((features, index) => (
                  <Link href={features.link} key={index}>
                    <div
                      className="hover:text-gray-300 transition-colors duration-300"
                      key={index}
                    >
                      {features.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
