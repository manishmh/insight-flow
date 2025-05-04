import CreateBlockSvg from "@/components/global/svg/create-block-svg";
import { ReactNode, useEffect, useRef } from "react";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { FaRegKeyboard } from "react-icons/fa";
import {
  FaArrowRightLong,
  FaBoxArchive,
  FaLink,
  FaRegCopy,
} from "react-icons/fa6";
import { GoMail } from "react-icons/go";
import { IoMoonOutline } from "react-icons/io5";
import {
  MdOutlineAddchart,
  MdOutlineDriveFileRenameOutline,
} from "react-icons/md";

const pillOneData = [
  { name: "Invite to board", logo: <GoMail /> },
  { name: "Rename board", logo: <MdOutlineDriveFileRenameOutline /> },
  { name: "Change theme: Dark", logo: <IoMoonOutline /> },
  { name: "Command bar", logo: <FaRegKeyboard /> },
  { name: "Invite to board", logo: <GoMail /> },
  { name: "Archive board", logo: <FaBoxArchive /> },
  { name: "Create block", logo: <CreateBlockSvg /> },
];

const pillTwoData = [
  { name: "Duplicate block", logo: <FaRegCopy /> },
  { name: "Coming soon", logo: <AiOutlineThunderbolt /> },
  { name: "Create block", logo: <CreateBlockSvg /> },
  { name: "Copy board link", logo: <FaLink /> },
  { name: "Change Chart Type", logo: <MdOutlineAddchart /> },
  { name: "Go to board", logo: <FaArrowRightLong /> },
  { name: "Contact support", logo: <BiComment /> },
];

const EffortlessWorkspace = () => {
  const firstContainerRef = useRef<HTMLDivElement | null>(null);
  const secondContainerRef = useRef<HTMLDivElement | null>(null);
  const firstAnimationFrameId = useRef<number | null>(null);
  const secondAnimationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const firstContainer = firstContainerRef.current;
    const secondContainer = secondContainerRef.current;

    if (!firstContainer || !secondContainer) return;

    const scrollSpeed = 0.5; 
    let scrollLeft = 0;
    let scrollRight = 0;

    const scrollFirst = () => {
      scrollLeft -= scrollSpeed;

      if (scrollLeft <= -firstContainer.scrollWidth / 2) {
        scrollLeft = 0;
      }

      firstContainer.style.transform = `translateX(${scrollLeft}px)`;

      firstAnimationFrameId.current = requestAnimationFrame(scrollFirst);
    };

    const scrollSecond = () => {
      scrollRight -= scrollSpeed;

      if (scrollRight <= -secondContainer.scrollWidth / 2) {
        scrollRight = 0;
      }

      secondContainer.style.transform = `translateX(${scrollRight}px)`;

      secondAnimationFrameId.current = requestAnimationFrame(scrollSecond);
    };

    firstContainer.innerHTML += firstContainer.innerHTML;

    secondContainer.innerHTML += secondContainer.innerHTML;

    firstAnimationFrameId.current = requestAnimationFrame(scrollFirst);
    secondAnimationFrameId.current = requestAnimationFrame(scrollSecond);

    return () => {
      if (firstAnimationFrameId.current) {
        cancelAnimationFrame(firstAnimationFrameId.current);
      }
      if (secondAnimationFrameId.current) {
        cancelAnimationFrame(secondAnimationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 self-center border border-gray-300 px-3 shadow py-1 rounded-lg text-gray-700">
          <CreateBlockSvg /> Effortless workflows
        </div>
        <h1 className="text-3xl xl:text-5xl text-center font-medium text-gray-900">
          Every action at your fingertips
        </h1>
        <h2 className="text-center mx-auto text-gray-500 md:text-lg">
          Stay flow and improve your workflow with our command bar, providing
          easy <br className="hidden md:block" /> access to all features through
          just a few keystrokes.
        </h2>
      </div>
      <div className="relative py-8 flex flex-col justify-center overflow-hidden max-w-screen-xl mx-auto">
        <ContainerGrad />
        <div
          className="flex items-center gap-4 max-w-screen-xl mx-auto py-2 px-2"
          ref={firstContainerRef}
        >
          {pillOneData.map((pill, index) => (
            <EffortlessWorkspacePill
              key={index}
              name={pill.name}
              logo={pill.logo}
            />
          ))}
        </div>
        <div
          className="flex items-center gap-4 max-w-screen-xl mx-auto py-2 px-2"
          ref={secondContainerRef}
        >
          {pillTwoData.map((pill, index) => (
            <EffortlessWorkspacePill
              key={index}
              name={pill.name}
              logo={pill.logo}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EffortlessWorkspace;

const EffortlessWorkspacePill = ({
  name,
  logo,
}: {
  name: string;
  logo: ReactNode;
}) => {
  return (
    <div className="flex flex-shrink-0 items-center gap-3 border border-gray-300 shadow-md py-1 px-3 rounded-full text-gray-600">
      {logo}
      {name}
    </div>
  );
};

const ContainerGrad = () => {
  return (
    <>
      <div className="bg-gradient-to-l from-[#e1e8ee] to-transparent w-2/12 h-full absolute right-0 z-10"></div>
      <div className="bg-gradient-to-r from-[#e1e8ee] to-transparent w-2/12 h-full absolute left-0 z-10"></div>
      <div className="bg-gradient-to-l from-[#e1e8ee] to-transparent w-2/12 h-full absolute right-0 z-10"></div>
      <div className="bg-gradient-to-r from-[#e1e8ee] to-transparent w-2/12 h-full absolute left-0 z-10"></div>
    </>
  );
};
