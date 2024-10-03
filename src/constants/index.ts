export const sponsors = [
    {
        name: "ChartJS",
        img: "chartjs.webp"
    },
    {
        name: "Cognos",
        img: "cognos.png"
    },
    {
        name: "D3.js",
        img: "d3-black.png"
    },
    {
        name: "Looker",
        img: "looker.svg"
    },
    {
        name: "Microstrategy",
        img: "microstrategy.svg"
    },
    // {
    //     name: "Plotly",
    //     img: "plotly.png"
    // },
    {
        name: "PowerBI",
        img: "Power-Bi.webp"
    },
    {
        name: "Qlik",
        img: "qlik.png"
    },
    {
        name: "Sisense",
        img: "sisense.png"
    },
    {
        name: "PowerBI",
        img: "Power-Bi.webp"
    },
    {
        name: "Tableu",
        img: "tableu.png"
    },
]

export const customers = [
  {
    id: 186352,
    dateJoined: "01/31/2022",
    city: "Vancouver",
    totalSpending: 1521.20,
    totalOrders: 102,
    lastOrder: "09/31/2023",
    membership: "Plus"
  },
  {
    id: 108231,
    dateJoined: "12/08/2021",
    city: "Toronto",
    totalSpending: 1101.46,
    totalOrders: 84,
    lastOrder: "09/11/2023",
    membership: "Plus"
  },
  {
    id: 87826,
    dateJoined: "10/14/2021",
    city: "Vancouver",
    totalSpending: 846.65,
    totalOrders: 78,
    lastOrder: "10/03/2023",
    membership: "Plus"
  },
  {
    id: 492012,
    dateJoined: "06/01/2022",
    city: "Vancouver",
    totalSpending: 982.02,
    totalOrders: 77,
    lastOrder: "06/16/2023",
    membership: "Plus"
  },
  {
    id: 156902,
    dateJoined: "02/23/2023",
    city: "Toronto",
    totalSpending: 964.30,
    totalOrders: 72,
    lastOrder: "07/21/2023",
    membership: "Plus"
  },
  {
    id: 411821,
    dateJoined: "05/19/2022",
    city: "Montreal",
    totalSpending: 802.50,
    totalOrders: 71,
    lastOrder: "07/25/2023",
    membership: "Basic"
  },
  {
    id: 117320,
    dateJoined: "08/31/2022",
    city: "Ottawa",
    totalSpending: 856.04,
    totalOrders: 65,
    lastOrder: "08/15/2023",
    membership: "Basic"
  }
];

export const queriesData = [
    `
        <span class="pl-2 pr-4 text-gray-500">1</span> <span class="text-[#cb7832]">SELECT</span> city, <span class="text-[#cb7832]">COUNT</span>(*) <span class="text-[#cb7832]">AS</span> num_orders <br />
        <span class="pl-2 pr-4 text-gray-500">2</span> <span class="text-[#cb7832]">FROM</span> orders <br />
        <span class="pl-2 pr-4 text-gray-500">3</span> <span class="text-[#cb7832]">GROUP BY</span> city<br />
        <span class="pl-2 pr-4 text-gray-500">4</span> <span class="text-[#cb7832]">ORDER BY</span> num_orders <span class="text-[#cb7832]">DESC</span> <br />
        <span class="pl-2 pr-4 text-gray-500">5</span> <span class="text-[#cb7832]">LIMIT</span> 100; <br />
    `,
    `
        <span class="pl-2 pr-4 text-gray-500">1</span> <span class="text-[#cb7832]">SELECT</span> city, <span class="text-[#cb7832]">SUM</span>(order_value) <br />
        <span class="pl-2 pr-4 text-gray-500">2</span> <span class="text-[#cb7832]">FROM</span> orders <br />
        <span class="pl-2 pr-4 text-gray-500">3</span> <span class="text-[#cb7832]">WHERE</span> order_date >= '2018-01-01' <br />
        <span class="pl-2 pr-4 text-gray-500">4</span> <span class="text-[#cb7832]">AND</span> order_date <= NOW() <br />
        <span class="pl-2 pr-4 text-gray-500">5</span> <span class="text-[#cb7832]">GROUP BY</span> city <br />
        <span class="pl-2 pr-4 text-gray-500">6</span> <span class="text-[#cb7832]">ORDER BY</span> num_orders <span class="text-[#cb7832]">DESC</span> <br />
        <span class="pl-2 pr-4 text-gray-500">7</span> <span class="text-[#cb7832]">LIMIT</span> 100; <br />
    `,
    `
        <span class="pl-2 pr-4 text-gray-500">1</span> <span class="text-[#cb7832]">SELECT</span> <span class="text-[#cb7832]">AVG</span>(order_value) <span class="text-[#cb7832]">AS</span> average_order_value <br />
        <span class="pl-2 pr-4 text-gray-500">2</span> <span class="text-[#cb7832]">FROM</span> orders <br />
        <span class="pl-2 pr-4 text-gray-500">3</span> <span class="text-[#cb7832]">WHERE</span> order_date > '2018-01-01' <br />
        <span class="pl-2 pr-4 text-gray-500">4</span> <span class="text-[#cb7832]">AND</span> order_date <= <span class="text-[#cb7832]">NOW</span>() <br />
        <span class="pl-2 pr-4 text-gray-500">5</span> <span class="text-[#cb7832]">AND</span> country = 'CANADA' <br />
    `,
    `
        <span class="pl-2 pr-4 text-gray-500">1</span> <span class="text-[#cb7832]">SELECT</span> user_plan, <span class="text-[#cb7832]">COUNT</span>(*) <br />
        <span class="pl-2 pr-4 text-gray-500">2</span> <span class="text-[#cb7832]">FROM</span> user_table <br />
        <span class="pl-2 pr-4 text-gray-500">3</span> <span class="text-[#cb7832]">WHERE</span> user_type <> 'anonymous' <br />
        <span class="pl-2 pr-4 text-gray-500">4</span> <span class="text-[#cb7832]">AND</span> join_date >= '2018-01-01' <br />
        <span class="pl-2 pr-4 text-gray-500">5</span> <span class="text-[#cb7832]">AND</span> join_date =< <span class="text-[#cb7832]">NOW</span>() <br />
        <span class="pl-2 pr-4 text-gray-500">6</span> <span class="text-[#cb7832]">GROUP BY</span> user_plan <br />
        <span class="pl-2 pr-4 text-gray-500">7</span> <span class="text-[#cb7832]">ORDER BY</span> user_count <span class="text-[#cb7832]">DESC</span> <br />
        <span class="pl-2 pr-4 text-gray-500">8</span> <span class="text-[#cb7832]">LIMIT</span> 2; <br />
    `
]