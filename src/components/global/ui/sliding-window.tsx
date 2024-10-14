import Link from "next/link";
import { ReactNode } from "react";

const SlidingButton = ({
  bg,
  content,
  logo,
  link,
}: {
  bg: string;
  content: string;
  logo: ReactNode;
  link: string;
}) => {
  return (
    <Link href={link}>
      <button className={`relative group flex items-center gap-2 text-black px3 rounded-md md:text-sm overflow-hidden ${bg}`}>
        <div className="absolute transition-all duration-500 inset-0 flex items-center justify-center -translate-x-full group-hover:translate-x-0">{logo}</div>
        <div className="group-hover:translate-x-full transition-all duration-500 px-4 py-1 h-full font-medium">{content}</div>
      </button>
    </Link>
  );
};

export default SlidingButton;
