"use client";

import React, { useState, useEffect } from "react";
import { Pagination, Select, SelectItem, Button } from "@nextui-org/react";
import { fetch_table_data } from "@/config/admin/authservice";
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

  const handleFilterChange = (value: string) => {
    setFilter(value as "all" | "blocked" | "unblocked");
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
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [searchTerm, currentPage, columns, apiUrl, filter]);

  return (
    <div className="w-full max-w-6xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-1/2">
          <SearchInput onSearch={setSearchTerm} />
        </div>

        <div className="flex flex-row flex-wrap gap-4 items-center">
          {blockfilter && (
            <Select
              placeholder="Filter"
              selectedKeys={[filter]}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="w-full sm:w-auto min-w-[150px] bg-gray-50 rounded-md shadow-sm"
            >
              <SelectItem key="all" value="all">
                All
              </SelectItem>
              <SelectItem key="blocked" value="blocked">
                Blocked
              </SelectItem>
              <SelectItem key="unblocked" value="unblocked">
                Unblocked
              </SelectItem>
            </Select>
          )}

          {buttonName && (
            <Button
              onClick={addButton}
              className="flex-none w-full sm:w-auto px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-md"
            >
              {buttonName}
            </Button>
          )}
        </div>
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse rounded-lg shadow-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-left bg-gray-50 text-gray-700"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 text-sm text-gray-700"
                    >
                      {column.render
                        ? column.render(row)
                        : (row[column.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-4">
        {data.length > 0 ? (
          data.map((row, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <div className="space-y-2">
                {columns.map((column) => (
                  <div key={String(column.key)} className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500">
                      {column.label}
                    </span>
                    <span className="text-sm text-gray-700">
                      {column.render
                        ? column.render(row)
                        : (row[column.key] as React.ReactNode)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No data available
          </div>
        )}
      </div>

      <div className="flex justify-center items-center mt-6">
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
