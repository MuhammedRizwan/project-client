"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ Name = "HEAVEN FINDER" }) {
  const pathname = usePathname();

  return (
    <aside className="h-screen bg-white shadow-lg w-64 ms-5 mb-20 mt-8">
      <div className="p-6">
        <h1 className="text-2xl font-bold">{Name}</h1>
      </div>
      <nav className="mt-2">
        <ul className="space-y-4">
          <li
            className={`flex items-center ${
              pathname === "/admin/dashboard" ? "bg-gray-100" : "bg-white"
            } shadow-lg rounded-lg px-6 py-4 cursor-pointer`}
          >
            <Link href="/admin/dashboard" className="flex items-center w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-yellow-500 mr-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75V3m-17.25 0h17.25M3.75 3l8.25 6.75L20.25 3"
                />
              </svg>
              <span className="text-gray-700">Dashboard</span>
            </Link>
          </li>

          {/* Users */}
          <li
            className={`flex items-center ${
              pathname === "/admin/user" ? "bg-gray-300" : "bg-white"
            } shadow-lg rounded-lg px-6 py-4 cursor-pointer`}
          >
            <Link href="/admin/user" className="flex items-center w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-yellow-500 mr-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11.25v1.5M9.75 13.5h4.5M3.75 3v11.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75V3M3.75 3l8.25 6.75L20.25 3"
                />
              </svg>
              <span className="text-gray-700">Users</span>
            </Link>
          </li>

          {/* Travel Agencies */}
          <li
            className={`flex items-center ${
              pathname === "/admin/travel-agencies" ? "bg-gray-100" : "bg-white"
            } shadow-lg rounded-lg px-6 py-4 cursor-pointer`}
          >
            <Link href="/admin/travel-agencies" className="flex items-center w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-yellow-500 mr-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12.75v6m-15-6v6m7.5-15l-6 6.75h12l-6-6.75z"
                />
              </svg>
              <span className="text-gray-700">Travel Agencies</span>
            </Link>
          </li>

          {/* Bookings */}
          <li
            className={`flex items-center ${
              pathname === "/admin/bookings" ? "bg-gray-100" : "bg-white"
            } shadow-lg rounded-lg px-6 py-4 cursor-pointer`}
          >
            <Link href="/admin/bookings" className="flex items-center w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-yellow-500 mr-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11.25v1.5M9.75 13.5h4.5M3.75 3v11.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75V3M3.75 3l8.25 6.75L20.25 3"
                />
              </svg>
              <span className="text-gray-700">Bookings</span>
            </Link>
          </li>

          {/* Notifications */}
          <li
            className={`flex items-center ${
              pathname === "/admin/notifications" ? "bg-gray-100" : "bg-white"
            } shadow-lg rounded-lg px-6 py-4 cursor-pointer`}
          >
            <Link href="/admin/notifications" className="flex items-center w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-yellow-500 mr-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11.25v1.5M9.75 13.5h4.5M3.75 3v11.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75V3M3.75 3l8.25 6.75L20.25 3"
                />
              </svg>
              <span className="text-gray-700">Notifications</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
