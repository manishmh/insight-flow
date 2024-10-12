import { useEffect, useState } from "react";
import POBDetails from "./pob-details"
import { FaWifi } from "react-icons/fa6";
import { IoCloudOfflineOutline } from "react-icons/io5";
import { IoMenuOutline } from "react-icons/io5";
import { FiWifiOff } from "react-icons/fi";
import FloatingDivs from "@/components/global/floating-divs";

const OfflineSupport = () => {
  const [online, setOnline] = useState(true)

  useEffect(() => {
    const handleOnlineState = setTimeout(() => {
        setOnline(!online)
    }, 10000)

    return () => clearTimeout(handleOnlineState)
  })

  return (
    <div className="space-y-4">
        <div className="h-[220px] flex flex-col justify-start items-start relative overflow-hidden">
            <div className="flex items-center gap-4 bg-[#eaf2f8] bg-opacity-40 shadow-md rounded-lg px-4 py-2 relative z-10">
                <IoMenuOutline className="text-gray-600 text-xl"/>
                <span className="text-gray-800">Supercart</span>
                <div className={`px-3 py-1 flex items-center text-sm justify-center rounded-md gap-2 w-[95px] ${online ? "bg-red-100" : "bg-gray-300"}`}>
                    <span className={`transition-all duration-500 ${online ? "text-red-600 translate-x-[2px]" : "text-gray-500 translate-x-0"}`}>
                        {online ? <FaWifi / > : <FiWifiOff />}
                    </span>
                    <span className={`transition-all duration-500 ${online ? "text-red-600 translate-x-[2px]" : "text-gray-500 translate-x-0"}`}>
                        {online ? "Online" : "Offline"}
                    </span>
                </div>
            </div>
            <div className={`p-2 bg-[#2f3f5d] text-white rounded-md mt-4 transition-all duration-700 w-1/2 md:w-1/3 text-xs relative z-10
                ${!online ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"}`}>
                Offline Mode. Your changes will be synced once your connection is restored.
            </div>
            <FloatingDivs online={online}/>
        </div>
        <POBDetails 
            logo={<FiWifiOff />}
            heading="Offline Support"
            desc="Keep doing you analysis anywhere you are. Everything will sync back when you come online."
        />
    </div>
  )
}

export default OfflineSupport