import { ReactNode } from "react"

const POBDetails = ({ logo, heading, desc }: { logo: ReactNode, heading: string, desc: string }) => {
  return (
    <div className="pb-14 border-b border-gray-400 px-4 border-dashed">
        <div className="flex items-center font-medium gap-2 text-gray-700">
            <span className="text-xl">{logo}</span>
            <h1>{heading}</h1>
        </div>
        <div className="text-gray-700 pt-1">{desc}</div>
    </div>
  )
}

export default POBDetails