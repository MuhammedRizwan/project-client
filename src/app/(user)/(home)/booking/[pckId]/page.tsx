'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function BookingForm({ params }: { params: { pckId: string } }) {
  console.log(params.pckId)
  const router=useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    memberName: '',
    memberAge: '',
    discountCode: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const handleAddMember = () => {
    console.log('Member added:', { name: formData.memberName, age: formData.memberAge })
    setFormData(prevState => ({
      ...prevState,
      memberName: '',
      memberAge: ''
    }))
  }

  const handleApplyDiscount = (code: string) => {
    console.log('Discount applied:', code)
    setFormData(prevState => ({
      ...prevState,
      discountCode: code
    }))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Book Now</h1>
      <p className="text-gray-600 mb-6">
        Please fill out the form below to book your trip.
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Input your First Name in Here"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Input your Last Name in Here"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Input your Email Address in Here"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="flex">
                <select className="p-2 border rounded-l-md bg-gray-50">
                  <option>+91</option>
                </select>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border-t border-b border-r rounded-r-md"
                  placeholder="Input your Phone Number in Here"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Input your Address in Here"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Add Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="memberName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="memberName"
                  name="memberName"
                  value={formData.memberName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Input your First Name in Here"
                />
              </div>
              <div>
                <label htmlFor="memberAge" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  id="memberAge"
                  name="memberAge"
                  value={formData.memberAge}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Input your Age in Here"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddMember}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              Add
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Continue to Payment
          </button>
        </form>

        <div className="w-full md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Brazil, Iguazu waterfall"
              width={300}
              height={200}
              className="w-full rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">Brazil, Iguazu waterfall</h2>
            <div className="flex justify-between items-center mb-4">
              <button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600" onClick={()=>{router.back()}}>
                Details
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-600">Start From</p>
                <p className="text-xl font-bold">₹23000<span className="text-sm font-normal">/person</span></p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">Discount / promotion</h3>
            <input
              type="text"
              value={formData.discountCode}
              onChange={handleInputChange}
              name="discountCode"
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Type Discout code"
            />
            {['FREE100', 'NEW250', 'AS500'].map((code) => (
              <button
                key={code}
                onClick={() => handleApplyDiscount(code)}
                className="mr-2 mb-2 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}