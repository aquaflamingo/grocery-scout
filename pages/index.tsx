import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState, useEffect } from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const inter = Inter({ subsets: ['latin'] })


type RetailerData = {
	[itemName: string]: { [year: string]: string };
};

type Retailers = {
	[retailerName: string]: RetailerData;
};

type Item = {
	name: string;
	averagePrice: number;
};

type Props = {
	retailers: Retailers;
};

export default function Home({ retailers }: InferGetStaticPropsType<typeof getStaticProps>) {
	const [selectedRetailer, setSelectedRetailer] = useState(Object.keys(retailers)[0]);
	const [items, setItems] = useState<Item[]>([]);

	useEffect(() => {
		setItems(getItems(selectedRetailer, retailers[selectedRetailer]));
		}, [selectedRetailer, retailers]);

	const handleRetailerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedRetailer(event.target.value);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h1 className="text-4xl font-bold mb-6">Toronto Grocery Scout</h1>
			<p>Using OpenAI's ChatGPT, the following indices of prices were compiled for produce through to 2021. If the item isn't listed it is because ChatGPT couldn't find it.</p>
			<br/>
			<select
				value={selectedRetailer}
				onChange={handleRetailerChange}
				className="rounded-lg border border-gray-300 px-4 py-2 mb-6"
			>
				{Object.keys(retailers).map((retailerName) => (
					<option key={retailerName} value={retailerName}>
						{retailerName}
					</option>
				))}
			</select>
			<h2 className="text-2xl font-bold mb-4">{selectedRetailer}</h2>
			<ul className="text-lg">
				{items.map((item) => (
					<li key={item.name} className="mb-2">
						{item.name}: ${item.averagePrice.toFixed(2)}
					</li>
				))}
			</ul>
		</div>
		);
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const retailers: Retailers = await import("./data.json").then((module) => module.default);
	return {
		props: {
			retailers,
		},
		};
};

function getItems(retailerName: string, retailerData: RetailerData): Item[] {
  const items: Item[] = [];
  for (const itemName in retailerData) {
    const price = parseFloat(retailerData[itemName]);
    if (!isNaN(price)) {
      items.push({ name: itemName, averagePrice: price });
    }
  }
  return items;
}

