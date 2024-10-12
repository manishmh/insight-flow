import DoneSvg from "@/components/global/done-svg";
import LoadingSpinner from "@/components/global/loader";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { IoMdNotifications } from "react-icons/io";
import POBDetails from "./pob-details";

// Define slideIn outside of the component to avoid re-creating it on every render
const slideIn = {
  hidden: { opacity: 0, x: -100 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 2,
      type: "spring",
      stiffness: 50,
    },
  }),
};

const RobustAlerting = () => {
  const [showCheck, setShowCheck] = useState(false);
  const [restart, setRestart] = useState(true);
  const [translate, setTranslate] = useState(false);
  const [key, setKey] = useState(0); // Add a state for key

  const slideInRef = useRef(slideIn);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCheck(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, [showCheck]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTranslate(false);
      setShowCheck(false);

      // Add a small delay before resetting restart
      setTimeout(() => {
        setRestart(false);
        setRestart(true); // Restart the animation
        setKey((prevKey) => prevKey + 1); // Change the key to reset the animation
      }, 100); // Delay to allow div to disappear, then trigger re-render

    }, 6000);
    return () => clearTimeout(timer);
  }, [restart, showCheck]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTranslate(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [translate]);

  return (
    <div className="space-y-4 overflow-hidden h-full flex flex-col justify-between max-w-2xl">
      <div className="h-[240px] md:h-[220px] overflow-hidden">
        {restart && (
          <>
            <div
              className={`transition-all duration-500 ${
                translate ? "-translate-y-1/2" : "translate-y-0"
              }`}
            >
              <motion.div
                key={key} 
                className="shadow-md flex flex-col items-start gap-2 bg-[#eaf2f8] px-8 py-4 rounded-xl font-mono"
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="bg-gray-300 px-2 py-1 rounded-md flex items-center gap-2"
                  custom={0}
                  variants={slideInRef.current}
                >
                  <span className="text-orange-500 font-mono pr-2 font-medium">
                    If
                  </span>{" "}
                  &quot;Monday, 9 AM&quot;{" "}
                  <span>
                    {!showCheck ? (
                      <LoadingSpinner />
                    ) : (
                      <span
                        className={`transition-all duration-1000 ${
                          !showCheck ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <DoneSvg />
                      </span>
                    )}
                  </span>
                </motion.div>

                <motion.div
                  className="bg-gray-300 px-2 py-1 rounded-md ml-4 md:ml-8 flex items-center gap-2"
                  custom={1.5}
                  variants={slideInRef.current}
                >
                  <div className="whitespace-nowrap">
                    <span className="text-orange-500 font-mono pr-2 font-medium">
                      And
                    </span>{" "}
                    &quot;Count on user subscrption&apos; &gt; 10,000
                  </div>
                  <span>
                    <DoneSvg />
                  </span>
                </motion.div>

                <motion.div
                  className="bg-gray-300 px-2 py-1 rounded-md ml-6 md:ml-16 flex items-center gap-2 whitespace-nowrap"
                  custom={2}
                  variants={slideInRef.current}
                >
                  <span className="text-orange-500 font-mono pr-2 font-medium">
                    Then
                  </span>{" "}
                  &quot;Send Slack message&quot;
                  <span>
                    <DoneSvg />
                  </span>
                </motion.div>
              </motion.div>
            </div>
            <div
              className={`bg-[#eaf2f8] px-4 py-4 rounded-xl drop-shadow-md flex gap-4 transition-all mt-2 duration-500 ${
                translate ? "-translate-y-1/2" : "translate-y-[60%] mt-8"
              }`}
            >
              <div>
                <Image
                  src="/logo2-nodesc.png"
                  alt="logo-for-other-use"
                  width={60}
                  height={60}
                />
              </div>
              <div>
                <div className="flex gap-2 items-center">
                  <span className="font-medium">Index</span>
                  <span className="text-gray-500">9:01 AM</span>
                </div>
                <p className="text-gray-700 line-clamp-3">
                  Good news to kickstart your week. User subscriptions on this
                  line chart have crossed the 10,000 mark. This is 12% higher
                  than last week. Cheers to more!
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <POBDetails
        logo={<IoMdNotifications />}
        heading="Robust alerting (Coming Soon)"
        desc="Whether you need to schedule recurrent alerts or define advanced conditions, you can build it on Index."
      />
    </div>
  );
};

export default RobustAlerting;
