import Image from "next/image";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa6";
import { GrConnect } from "react-icons/gr";

const ConnectYourData = () => {
  return (
    <div className='px-2 md:px-8 max-w-screen-2xl mx-auto'>
        <div className="flex items-center flex-col gap-4">
            <div className='text-gray-700 text-center flex items-center gap-2 border border-gray-300 rounded-full px-4 self-center mx-auto'><FaDatabase /> Data harmony</div>
            <div className="text-gray-800 text-3xl xl:text-5xl font-medium">Connect your data</div>
            <h1 className="text-center text-gray-600">Index connects to a growing number of <br /> databases and data warehouses.</h1>
            <button className="bg-[#2f3f5d] text-white px-4 pr-8 group py-2 rounded-lg transition-colors duration-300 shadow-sm flex gap-2 items-center overflow-hidden relative">
                <span className="-translate-x-[200px] group-hover:translate-x-0 transition-all duration-500 relative left-1/2"><GrConnect /></span>
                <span className="group-hover:translate-x-[200px] transition-all duration-500">Get started now</span>
            </button>
        </div>
        <div className="mt-20 relative flex flex-col md:flex-row items-center gap-12">
            <div className="md:h-1 bg-[#4a5d89] rounded-md absolute md:top-1/2 w-1 h-full md:w-full"></div>
            <div className="rounded-full absolute md:left-0 md:ldot text-2xl text-[#111b34] tdot md:hidden"><FaChevronRight className="rotate-90 md:rotate-0"/></div>
            <div className="rounded-full absolute bottom-0 md:right-0 md:rdot text-2xl text-[#121b31] bdot md:hidden"><FaChevronLeft className="rotate-90 md:rotate-0"/></div>

            <div className="rounded-full absolute md:left-0 ldot text-2xl text-[#111b34] hidden md:block"><FaChevronRight className="rotate-90 md:rotate-0"/></div>
            <div className="rounded-full absolute md:right-0 rdot text-2xl text-[#121b31] hidden md:block"><FaChevronLeft className="rotate-90 md:rotate-0"/></div>
            <div className="relative flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-0">
               <SingleDatabase 
                    img="/databases/2.png" 
                    index="1"
               /> 
               <SingleDatabase 
                    img="/databases/oracle.png" 
                    index="1"
               /> 
               <SingleDatabase 
                    img="/databases/postgres.png" 
                    index="1"
               /> 
            </div>
            <div className="w-full flex justify-center">
                <div className="relative bg-white rounded-2xl p-2 py-3 shadow-md">
                    <Image 
                        src="/logo2-nodesc.png"
                        alt="main-logo"
                        width={70}
                        height={70}
                    />
                </div>
            </div>
            <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-0 justify-between w-full">
               <SingleDatabase 
                    img="/databases/4.png" 
                    index="11"
               /> 
               <SingleDatabase 
                    img="/databases/6.png" 
                    index="12"
               /> 
               <SingleDatabase 
                    img="/databases/5.png" 
                    index="13"
               /> 
            </div>
        </div>
    </div>
  )
}

export default ConnectYourData

const SingleDatabase = ({ img, index }: { img: string, index: string }) => {
    return (
        <div className="bg-white rounded-full p-3 border-2 border-gray-300 shadow-xl">
            <Image 
                src={img} 
                alt={index}
                width={30}
                height={30}
            />
        </div>
    )
}