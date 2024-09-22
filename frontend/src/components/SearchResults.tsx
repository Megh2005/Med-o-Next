import { ProductData } from "@/lib/interfaces/Product";
import ProductSearchResult from "./ProductSearchResult";

const SearchResults = ({ searchResults }: { searchResults: ProductData[] }) => {
  return (
    <div className="w-3/4 px-4 md:px-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {searchResults.map((product) => {
        return <ProductSearchResult key={product._id} product={product} />;
      })}
    </div>
  );
};

export default SearchResults;
