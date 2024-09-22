import { useDebounce } from "use-debounce";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import axios from "axios";
import { BACKEND_URL, PAGINATION_OFFSET } from "@/utils/constants";
import { ProductData } from "@/lib/interfaces/Product";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductAdminItem from "@/components/ProductAdminItem";
import { Link, useNavigate } from "react-router-dom";

const Admin = () => {
  const [productList, setProductList] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchValue] = useDebounce(searchQuery, 400);
  const navigate = useNavigate();

  const [pageInfo, setPageInfo] = useState({
    totalCount: 0,
    page: 1,
    hasNextPage: false,
  });

  const getProducts = useCallback(
    async (isNewSearch = false, page = pageInfo.page) => {
      setLoading(true);

      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/admin/products?page=${page}&pageSize=${PAGINATION_OFFSET}&q=${debouncedSearchValue}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "med-o-shop-token"
              )}`,
            },
          }
        );

        if (response.data?.success) {
          if (isNewSearch) {
            setProductList(response.data.data.data);
          } else {
            setProductList((prevData) => [
              ...prevData,
              ...response.data.data.data,
            ]);
          }

          setPageInfo({
            totalCount: response.data.data?.metadata?.totalCount,
            page: isNewSearch ? 2 : pageInfo.page + 1,
            hasNextPage: response.data.data?.metadata.hasNextPage,
          });
        }
      } catch (error: any) {
        if (error.response.data.message === "Unauthorized") {
          navigate("/u/home");
        }
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearchValue, pageInfo.page]
  );

  useEffect(() => {
    getProducts(true, 1);
  }, [debouncedSearchValue]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={"/u/home"}>
            <ArrowLeft className="w-6 h-6 text-primary" />
          </Link>
          <h1 className="text-2xl font-bold">Manage Products</h1>
        </div>
        <Button>
          <Link to="/admin/add-product">Add Product</Link>
        </Button>
      </div>
      <div className="mb-6">
        <Input
          type="text"
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or description"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      {loading && productList.length === 0 && (
        <div className="flex justify-center">
          <LoaderCircle className="text-primary animate-spin h-7 w-7" />
        </div>
      )}
      {productList.length > 0 && (
        <div>
          <InfiniteScroll
            scrollThreshold={0.9}
            dataLength={productList.length}
            next={() => getProducts(false)}
            hasMore={pageInfo.hasNextPage}
            loader={
              loading && (
                <div className="flex justify-center">
                  <LoaderCircle className="text-primary animate-spin h-7 w-7" />
                </div>
              )
            }
          >
            <div className="grid grid-cols-6">
              <div className="px-4 mb-4 col-span-6 grid grid-cols-6">
                <div className=" text-gray-500 font-medium">Name</div>
                <div className="col-span-2 text-gray-500 font-medium">
                  Manufacturer
                </div>
                <div className=" text-gray-500 font-medium">Price</div>
                <div className=" text-gray-500 font-medium">Stock</div>
                <div className="text-gray-500 font-medium justify-self-end">
                  Actions
                </div>
              </div>
              <div className="col-span-6 grid grid-cols-6 gap-4">
                {productList.map((product) => (
                  <ProductAdminItem
                    productList={productList}
                    setProductList={setProductList}
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            </div>
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default Admin;
