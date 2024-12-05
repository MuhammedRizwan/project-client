import React, { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";


interface SearchInputProps {
  onSearch: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>(searchTerm);
  


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchTerm);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setSearchTerm(value);
    } else {
      alert("Search term cannot exceed 50 characters.");
    }
  };

  return (
    <div className="w-full">
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
        width="100%"
        startContent={<SearchIcon />}
      />
    </div>
  );
};

export default SearchInput;
