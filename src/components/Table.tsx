import {
  Pagination,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { fetch_table_data } from "@/api/admin/authservice";
import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import SearchInput from "./searchInput";


export interface TableColumn<T extends object> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T extends object> {
  columns: TableColumn<T>[];
  apiUrl: string;
  addButton?: () => void;
  buttonName?: string;
  blockfilter?: boolean;
}

const Table = <T extends object>({
  columns,
  apiUrl,
  addButton,
  buttonName,
  blockfilter = true,
}: TableProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<"all" | "blocked" | "unblocked">("all");

  const rowsPerPage = 8;

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement> ) => {
    setFilter(event.target.value as "all" | "blocked" | "unblocked");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch_table_data(
          apiUrl,
          searchTerm,
          currentPage,
          rowsPerPage,
          filter
        );
        const { filterData, totalPages } = response;
        setData(filterData);
        setTotalPages(totalPages);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [searchTerm, currentPage, columns, apiUrl, filter]);

  return (
    <div className="max-w-6xl m-2 bg-white p-2 rounded-lg shadow-lg">
      <div className="mb-4 flex justify-between">
        <div className="w-1/2">
          <SearchInput
            onSearch={setSearchTerm}
          />
        </div>

        {blockfilter && (
          <div className="me-4">
            <Select
              placeholder="All"
              value={filter}
              onChange={handleFilterChange}
              className="w-28"
            >
              <SelectItem value="all" key={"all"}>All</SelectItem>
              <SelectItem value="blocked" key={"blocked"}>Blocked</SelectItem>
              <SelectItem value="unblocked" key={"unblocked"}>Unblocked</SelectItem>
            </Select>
          </div>
        )}

        {buttonName && (
          <div className="mb-2">
            <button
              onClick={addButton}
              className="px-4 py-2 w-36 bg-yellow-600 text-white rounded"
            >
              {buttonName}
            </button>
          </div>
        )}
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

      <div className="flex justify-center items-center mt-4">
        <Pagination
          showControls
          total={totalPages}
          initialPage={1}
          page={currentPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default Table;
