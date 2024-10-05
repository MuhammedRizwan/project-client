
export default function TravelDashboard() {

  return (
    <div className="flex">
      
      <div className="flex-grow">

        <main className="p-4">
          {/* Dashboard Overview */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
              <p className="text-2xl font-bold">350</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-bold">$25,000</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">New Customers</h3>
              <p className="text-2xl font-bold">25</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
              <p className="text-2xl font-bold">10</p>
            </div>
          </section>

          {/* Bookings Section */}
          <section className="mt-8">
            <h2 className="text-lg font-bold">Recent Bookings</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Destination</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Travel Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap">Paris, France</td>
                    <td className="px-6 py-4 whitespace-nowrap">12th Nov 2024</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-500">Confirmed</td>
                  </tr>
                  {/* Add more bookings */}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
