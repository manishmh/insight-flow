import Image from "next/image";
import React from "react";

interface Data {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  address: string;
  state: string;
}

interface TableProps {
  data: Data[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-md border py-2 border-gray-300 shadow font-sans h-[90vh]">
      <table className="min-w-full overflow-scroll">
        <thead>
          <tr className="text-gray-400 uppercase text-xs leading-normal ">
            <th className="py-2 px-6 text-left font-medium">ID</th>
            <th className="py-2 px-6 text-left font-medium">First Name</th>
            <th className="py-2 px-6 text-left font-medium">Last Name</th>
            <th className="py-2 px-6 text-left font-medium">Email</th>
            <th className="py-2 px-6 text-left font-medium">Avatar</th>
            <th className="py-2 px-6 text-left font-medium">Address</th>
            <th className="py-2 px-6 text-left font-medium">State</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light">
          {data.slice(0, 50).map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-200 hover:bg-[#d7dde394]"
            >
              <td className=" px-6 text-left h-[40px]">{item.id}</td>
              <td className=" px-6 text-left">{item.first_name}</td>
              <td className=" px-6 text-left">{item.last_name}</td>
              <td className="px-6 text-left">
                <a
                  href={`mailto:${item.email}`}
                  className="text-blue-500 underline"
                >
                  {item.email}
                </a>
              </td>

              <td className=" px-6 text-left">
                {item.avatar ? (
                  <Image
                    src={item.avatar}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  "N/A"
                )}
              </td>
              <td className=" px-6 text-left">{item.address}</td>
              <td className=" px-6 text-left">{item.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
