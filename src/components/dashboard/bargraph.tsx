'use client'

import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Card, CardBody, CardHeader } from "@nextui-org/react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const data: ChartData<'bar'> = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Sales',
      data: [12, 19, 3, 5, 2, 3, 9],
      backgroundColor: 'rgba(54, 162, 235, 0.8)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
    {
      label: 'Revenue',
      data: [7, 11, 5, 8, 3, 7, 12],
      backgroundColor: 'rgba(255, 99, 132, 0.8)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
}

const options: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Monthly Performance',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

export default function BarGraph() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex-col items-start px-4 pt-4">
        <h4 className="font-bold text-large">Bar Graph</h4>
        <p className="text-tiny uppercase font-bold">Monthly Performance</p>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Bar data={data} options={options} />
      </CardBody>
    </Card>
  )
}

