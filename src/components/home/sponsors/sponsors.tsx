import Image from "next/image"
import { sponsors } from "@/constants"

const Sponsors = () => {
  return (
    <div className="px-2">
        <h1 className="text-center text-[#59606d] md:text-lg">Supported by Industry-Leading Data Analytics Partners.</h1>
        <div className="grid grid-cols-1 ssm:grid-cols-2 md:grid-cols-3 md:w-10/12 px-4 lg:grid-cols-5 gap-10 lg:w-8/12 mx-auto flex-wrap mt-8 place-items-center md:place-items-start">
            {sponsors.map((sponsor, index) => (
                <SingleSponsor 
                    key={index}
                    name={sponsor.name}
                    img={sponsor.img}
                />
            ))}
        </div>
    </div>
  )
}

export default Sponsors

const SingleSponsor = ({ name, img }: {name : string, img: string }) => {
    return (
        <div className="flex items-center gap-2 cursor-default select-none">
            <Image 
                src={`/sponsors/${img}`}
                alt={name}
                width={30}
                height={30}
                className="brightness-0 contrast-50"
            />
            <h1 className="font-semibold font-mono text-gray-600 md:text-xl">{name}</h1>
        </div>
    )
}