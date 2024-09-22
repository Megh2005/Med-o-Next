import { useState } from "react";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "lucide-react";

const SearchInput = () => {
  const [search, setSearch] = useState<string>("");
  const router = useNavigate();

  return (
    <div className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        onChange={(e) => setSearch(e.target.value)}
        type="search"
        value={search}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (search.trim() !== "") {
              router(`/u/search?q=${search}`);
              setSearch("");
            }
          }
        }}
        placeholder="Search for products, brands and more"
        className="block w-full pl-10 pr-4 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-md"
      />
    </div>
  );
};

export default SearchInput;
