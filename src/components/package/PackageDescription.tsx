'use client'

import React from 'react'
import { Card, CardBody, CardHeader, Divider, Accordion, AccordionItem } from "@nextui-org/react"
import { CheckCircle, XCircle, Calendar } from "lucide-react"
import Package from "@/interfaces/package"

export default function LeftPackage({ packageData }: { packageData: Package | null }) {
  if (!packageData) {
    return <div className="text-center p-8">Loading package details...</div>
  }

  return (
    <div className="py-10 px-16 space-y-8">
      <Card className="bg-gradient-to-r from-blue-100 to-purple-100">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md font-semibold">Included & Excluded</p>
            <p className="text-small text-default-500">What s in your package?</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Included:
              </h4>
              <ul className="space-y-2">
                {packageData.includedItems.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Divider orientation="vertical" className="hidden md:block" />
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-2 flex items-center">
                <XCircle className="w-5 h-5 mr-2 text-red-500" />
                Excluded:
              </h4>
              <ul className="space-y-2">
                {packageData.excludedItems.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex gap-3">
          <Calendar className="w-6 h-6 text-primary" />
          <div className="flex flex-col">
            <p className="text-md font-semibold">Itineraries</p>
            <p className="text-small text-default-500">Your day-by-day adventure</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <Accordion variant="splitted">
            {packageData.itineraries.map((itinerary) => (
              <AccordionItem
                key={itinerary.day}
                aria-label={`Day ${itinerary.day}`}
                title={`Day ${itinerary.day}`}
                subtitle={`${itinerary.activities.length} activities`}
                className="mb-2"
              >
                <ul className="space-y-2">
                  {itinerary.activities.map((activity, index) => (
                    <li key={index} className="flex items-start">
                      <span className="font-semibold text-primary mr-2">{activity.time}</span>
                      <span className="text-gray-700">{activity.activity}</span>
                    </li>
                  ))}
                </ul>
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
      </Card>
    </div>
  )
}