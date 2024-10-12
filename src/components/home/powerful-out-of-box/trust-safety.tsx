import POBDetails from "./pob-details"
import { GoShieldCheck } from "react-icons/go";
import { MdOutlineSecurity } from "react-icons/md";

const TrustSafety = () => {
  return (
    <div className="h-full max-w-2xl">
        <div className="h-[220px] pb-4 flex justify-center">
            <MdOutlineSecurity className="text-9xl text-gray-600"/>            
        </div>
        <POBDetails 
            logo={<GoShieldCheck />}
            heading="Trust & Safety" 
            desc="Built from day one with a privacy-focused design and compliant approach to securing your data."
        />
    </div>
  )
}

export default TrustSafety