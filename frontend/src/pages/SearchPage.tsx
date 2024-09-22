import FilterBox from "@/components/FilterBox";
import SearchInput from "@/components/SearchInput";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "@/lib/redux/slices/searchSlice";
import { RootState } from "@/lib/interfaces/RootState";
import SearchResultsSection from "@/components/SearchResultsSection";

const SearchPage = () => {
  const [params] = useSearchParams();
  const search = new URLSearchParams(params).get("q");
  const { query } = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!search) return;
    dispatch(setSearchQuery(search));
  }, [search]);

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 md:px-6 flex justify-center mt-4 mb-10">
        <SearchInput />
      </div>
      <div className="my-4">
        <h1 className="text-lg font-medium text-center">
          Search results for "{query}"
        </h1>
      </div>
      <div className="flex">
        <div className="w-1/4">
          <div className="ml-4 md:ml-6 sticky top-20">
            <FilterBox search={query} />
          </div>
        </div>
        <SearchResultsSection />
      </div>
    </main>
  );
};

export default SearchPage;
