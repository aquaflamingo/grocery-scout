import { useState, useEffect } from 'react';
import { parse } from 'csv-parser';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2'
ChartJS.register(...registerables);

const ChartComponent = ({ data }: Props) => {
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    const setChartData = () => {
      const datasets = data.map((rowData) => {
        const [label, ...prices] = rowData;
        return {
          label,
          data: prices,
          fill: false,
          borderColor: '#' + ((Math.random() * 0xffffff) << 0).toString(16),
        };
      });
      setDatasets(datasets);
    };
    if (data.length) {
      setChartData();
    }
  }, [data]);

  const chartData = {
    labels: [
      'Feb 2022',
      'Mar 2022',
      'Apr 2022',
      'May 2022',
      'Jun 2022',
      'Jul 2022',
      'Aug 2022',
      'Sep 2022',
      'Oct 2022',
      'Nov 2022',
      'Dec 2022',
      'Jan 2023',
      'Feb 2023',
    ],
    datasets: datasets,
  };

  return datasets.length ? <Line data={chartData} /> : null;
};

const GroceryGrowth = () => {
  const [data, setData] = useState<any>({});

	useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/statscan-on-food-data-2022-23.csv');
      const text = await response.text();
      const rows = text.split('\n');
      const rowData = rows.map((row) => {
        return row.split(',');
      });
      setData(rowData);
    };
    fetchData();
  }, []);

	console.log(data) 
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-lg">
        <h1 className="text-3xl font-bold mb-6">Grocery Growth in 2022</h1>
        <div className="h-96">
					<ChartComponent data={data} />
        </div>
      </div>
    </div>
  );
};

export default GroceryGrowth;
