import { filtered_data } from "@/config/user/authservice";
import React, { useState, useEffect } from "react";

export interface TableColumn<T extends object> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T extends object> {
  columns: TableColumn<T>[];
  apiUrl: string;
}

const Table = <T extends object>({ columns, apiUrl }: TableProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await filtered_data(apiUrl,searchTerm,currentPage,rowsPerPage);
        const { filterData, totalPages } = response;
        setData(filterData);
        setTotalPages(totalPages);
      } catch (error) {
       console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [searchTerm, currentPage, columns,apiUrl]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse rounded-lg shadow-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-center bg-gray-50"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center">
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4 text-xs">
                      {column.render
                        ? column.render(row)
                        : (row[column.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 text-xs bg-gray-200 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-xs bg-gray-200 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
