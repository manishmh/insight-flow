import BarChart from "@/components/global/charts/bar";
import {
  default as PieChart,
} from "@/components/global/charts/doughnut";
import Table from "@/components/global/charts/table";
import { sampleTableData } from "@/constants/sampel-table-data";

export type PieDataType = {
  value: number;
  color: string;
  title: string;
};

const pieData: PieDataType[] = [
  { value: 30.2, color: "#ff6384", title: "Toronto" },
  { value: 50, color: "#36a2eb", title: "Vancouvor" },
  { value: 40, color: "#ffce56", title: "Montreal" },
];

export type barDataType = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
    }[];
}

const barData: barDataType = {
  labels: [
    '2020-01', '2020-02', '2020-03', '2020-04', '2020-05', '2020-06',
    '2020-07', '2020-08', '2020-09', '2020-10', '2020-11', '2020-12',
    '2021-01', '2021-02', '2021-03', '2021-04', '2021-05', '2021-06',
    '2021-07', '2021-08', '2021-09', '2021-10', '2021-11', '2021-12',
    '2022-01'
  ],
  datasets: [
    {
      label: 'Count',
      data: [
        1, 4, 2, 5, 3, 8, 2, 6, 3, 4, 2.9, 5, 1, 3, 2, 6.0, 3.5, 4, 2, 1, 4.2, 6, 8, 7, 5
      ]
    }
  ]
};


const MainContent = () => {
  return (
    <div className="grid grid-cols-2 gap-2 box-content p-2">
      <div className="h-[330px] col-span-1 border border-gray-300 shadow rounded-md">
        <BarChart barData={barData}/>
      </div>
      <div className="h-[330px] col-span-1 border border-gray-300 shadow rounded-md">
        <PieChart data={pieData} circleColor="#e1e8ee" />
      </div>
      <div className="col-span-2">
        <Table data={sampleTableData}/> 
      </div>
    </div>
  );
};

export default MainContent;
