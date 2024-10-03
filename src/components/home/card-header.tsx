import { IoMenuSharp } from "react-icons/io5";
import { GoKebabHorizontal } from "react-icons/go";

const CardHeader = () => {
  return (
    <div className="flex justify-between gap-2 py-2 px-4 border-b border-gray-300 relative z-0">
        <div className="text-gray-800 text-xl flex items-center "><IoMenuSharp /></div>
        <div className="flex items-center gap-4">
            <div className="border rounded-full px-3 py-1 flex border-gray-300 ">
                <div className="w-5 aspect-square rounded-full bg-[#2a3a5e] border z-20"></div>
                <div className="w-5 aspect-square rounded-full bg-[#586d9f] -translate-x-2 z-10"></div>
                <div className="w-5 aspect-square rounded-full bg-[#7295e8] -translate-x-4 z-0"></div>
                <div className="text-gray-500">+ 1</div>
            </div>
            <GoKebabHorizontal />
        </div>
    </div>
  )
}

export default CardHeader