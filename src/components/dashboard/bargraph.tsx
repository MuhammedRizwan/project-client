"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface MonthlyDataItem {
  month: number; // Month (1-12)
  totalBookings: number;
  totalTransactions: number;
}

interface MonthlyGraphProps {
  data: MonthlyDataItem[];
}

export default function MonthlyGraph({ data }: MonthlyGraphProps) {
  const chartData: ChartData<"bar"> = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Bookings",
        data: data.map((item) => item.totalBookings),
        backgroundColor: "rgba(249, 115, 22, 0.8)", // Orange with 80% opacity
        borderColor: "rgba(249, 115, 22, 1)", // Fully opaque orange
        borderWidth: 1,
      },
      {
        label: "Revenue",
        data: data.map((item) => item.totalTransactions),
        backgroundColor: "rgba(24, 24, 27, 0.8)", // Zinc-900 with 80% opacity
        borderColor: "rgba(24, 24, 27, 1)", // Fully opaque Zinc-900
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Performance: Bookings & Revenue",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card className="w-full mx-auto my-3">
      <CardHeader className="flex-col items-start px-4 pt-4">
        <h4 className="font-bold text-large">Monthly Graph</h4>
        <p className="text-tiny uppercase font-bold">Booking & Revenue</p>
      </CardHeader>
      <CardBody className="overflow-visible py-2 w-full">
        <Bar data={chartData} options={options} />
      </CardBody>
    </Card>
  );
}
