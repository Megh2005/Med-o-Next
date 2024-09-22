import { RootState } from "@/lib/interfaces/RootState";
import { useDispatch, useSelector } from "react-redux";
import SearchResults from "@/components/SearchResults";
import { handleSearch } from "@/utils/searchRequest";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import {
  setSearchLoading,
  setSearchResults,
} from "@/lib/redux/slices/searchSlice";

const SearchResultsSection = () => {
  const dispatch = useDispatch();
  const { loading, results, query } = useSelector(
    (state: RootState) => state.search
  );
  const { filter } = useSelector((state: RootState) => state.filter);

  useEffect(() => {
    if (!query) return;
    fetchData();
  }, [query]);

  async function fetchData() {
    dispatch(setSearchLoading(true));
    const res = await handleSearch({ search: query, ...filter });
    if (res) {
      dispatch(setSearchResults(res));
      dispatch(setSearchLoading(false));
    }
  }

  return (
    <>
      {loading && (
        <div className="flex justify-center mt-8">
          <LoaderCircle className="animate-spin w-6 h-6" />
        </div>
      )}
      {!loading && results.length > 0 && (
        <SearchResults searchResults={results} />
      )}
    </>
  );
};

export default SearchResultsSection;
