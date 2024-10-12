"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className="flex justify-center w-full">
      <div
        className={`flex items-center max-w-screen-2xl w-full mx-auto px-4 gap-8 md:gap-2 lg:gap-8 md:px-2 lg:px-4 py-3 md:mt-4 fixed justify-between z-50
        ${
          isScrolled
            ? "bg-[#e1e8ee] shadow-lg rounded-2xl md:max-w-[700px] lg:max-w-[800px] transition-[max-width] duration-700"
            : "transition-[max-width] duration-700"
        }
    `}
      >
        <div className={`transition-all duration-700 `}>
          <Image
            src="/logo2-nodesc.png"
            alt="navbar-logo"
            width={40}
            height={50}
            quality={100}
            priority
          />
        </div>
        <div className="items-center gap-6 hidden md:flex relative">
          <NavbarItems item="Features" link="" />
          <NavbarItems item="Docs" link="" />
          <NavbarItems item="Pricings" link="" />
          <NavbarItems item="Careers" link="" />
          <NavbarItems item="Support" link="" />
        </div>
        <div
          className={`duration-700 transition-all flex gap-4`}
        >
          <button className="inline-flex py-1 animate-shimmer items-center justify-center rounded-md border dark:border-slate-800 dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-4 fontmedium dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-blue-700 border-slate-300 hover:bg-slate-300 transition-all duration-300 dark:duration-1000">
            Log in
          </button>
          {isScrolled && (
            <button className="inline-flex py-1 animate-shimmer items-center justify-center rounded-md border dark:border-slate-800 dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-4 fontmedium dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-blue-700 border-slate-300 hover:bg-slate-300 transition-all duration-300 dark:duration-1000">
              Sign up
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


function NavbarItems({ item, link }: { item: string; link: string }) {
  return (
    <div className="text-[#6e7378] hover:bg-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100 px-2 py-1 rounded-md transition-all duration-300 cursor-pointer">
      <Link href={link}>{item}</Link>
    </div>
  );
}
