import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

const SidebarItem = ({
    logo,
    title,
    num,
    link,
  }: {
    logo: ReactNode;
    title: string;
    num?: number;
    link?: string;
  }) => {
    const router = useRouter();
    const pathname = usePathname();
  
    const extractId = (url: string) => {
      const parts = url.split("/");
      return parts[parts.length - 1];
    };
  
    const activeId = extractId(pathname);
  
    return (
      <div
        className={`flex justify-between items-center group hover:bg-[#d1d5dbac] transition-all duration-300 pr-1 ml-1 rounded-md cursor-pointer ${
          link?.includes(activeId) ? "bg-[#d1d5dbac]" : ""
        }`}
        onClick={link ? () => router.push(link) : () => {}}
      >
        <div className="flex gap-2 items-center text-gray-600 text px-2 py-1 rounded-md">
          {logo}
          {title}
        </div>
        {num && (
          <div className="w-5 h-5 aspect-square border border-gray-300 group-hover:border-gray-400 grid place-items-center rounded-md text-gray-500">
            {num}
          </div>
        )}
      </div>
    );
  };
  
  export default SidebarItem;
