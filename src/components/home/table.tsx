import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const Table = () => {
  const data = [
    {
    id: 186352,
    dateJoined: '01/31/2022',
    city: 'Vancouver',
    totalSpending: 1521.20,
    totalOrders: 102
  },
  {
    id: 108231,
    dateJoined: '12/08/2021',
    city: 'Toronto',
    totalSpending: 1101.46,
    totalOrders: 84
  },
  {
    id: 87826,
    dateJoined: '10/14/2021',
    city: 'Vancouver',
    totalSpending: 846.65,
    totalOrders: 78
  },
  {
    id: 492012,
    dateJoined: '06/01/2022',
    city: 'Vancouver',
    totalSpending: 982.02,
    totalOrders: 77
  },
  {
    id: 156902,
    dateJoined: '02/23/2023',
    city: 'Toronto',
    totalSpending: 964.30,
    totalOrders: 72
  },
  {
    id: 411821,
    dateJoined: '05/19/2022',
    city: 'Montreal',
    totalSpending: 802.50,
    totalOrders: 69
  },
  {
    id: 117320,
    dateJoined: '08/31/2021',
    city: 'Ottawa',
    totalSpending: 856.04,
    totalOrders: 65
  },
  {
    id: 76639,
    dateJoined: '09/12/2021',
    city: 'Toronto',
    totalSpending: 716.64,
    totalOrders: 60
  },
  {
    id: 809523,
    dateJoined: '11/24/2022',
    city: 'Montreal',
    totalSpending: 702.12,
    totalOrders: 60
  }
  ];

  return (
    <div className="border border-gray-300 shadow pt-4 col-span-5 md:col-span-3">
      <div className="px-4 flex justify-between gap-4 pb-4">
        <h1 className="text-gray-500">Data Mutations</h1>
        <button className="bg-[#40557c] text-white px-6 hover:bg-[#3a5077] py-1 rounded-lg transition-colors duration-300 cursor-default">Edit</button>
      </div>
      <div className="overflow-scroll">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-[#3a5077] uppercase text-sm leading-normal">
              <th className="py-1 px-6 text-left">Id</th>
              <th className="py-1 px-6 text-left">DOJ</th>
              <th className="py-1 px-6 text-left">city</th>
              <th className="py-1 px-6 text-left">growth</th>
              <th className="py-1 px-6 text-left">index</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {data.map((person) => (
              <tr key={person.id} className="border-b border-gray-200 hover:bg[#b2bfd5]">
                <td className="py-1 px-6 text-left whitespace-nowrap">{person.id}</td>
                <td className="py-1 px-6 text-left">{person.dateJoined}</td>
                <td className="py-1 px-6 text-left">{person.city}</td>
                <td className="py-1 px-6 text-left">{person.totalSpending}</td>
                <td className="py-1 px-6 text-left">{person.totalOrders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center gap-4 py-2 text-gray-400 mt-2 border border-gray-300">
        <FaChevronLeft className="text-xs"/>
        <span>1 / 64</span>
        <FaChevronRight className="text-xs"/>
      </div>
    </div>
  )
}

export default Table