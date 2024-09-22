import ProductManageForm from "@/components/ProductManageForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { updateProductSchema } from "@/lib/schemas/product.schema";
import axios from "axios";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { ProductData } from "@/lib/interfaces/Product";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "@/utils/constants";

const UpdateProduct = () => {
  const param = useParams();
  const [productDetails, setProductDetails] = useState<ProductData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProductDetails() {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/admin/product-details/${param.productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "med-o-shop-token"
              )}`,
            },
          }
        );
        if (response.data.success) {
          setProductDetails(response.data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getProductDetails();
  }, []);

  if (loading)
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <LoaderCircle className="animate-spin mr-2 h-5 w-5 text-primary" />
      </div>
    );

  return (
    productDetails && (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Fill out the form to manage product information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductManageForm
              defaultFormValues={{
                ...productDetails,
                packSize: productDetails.packSize.toString(),
                stock: productDetails.stock.toString(),
                expiryDate: new Date(productDetails.expiryDate),
                manufacturedDate: new Date(productDetails.manufacturedDate),
              }}
              resourceAction="UPDATE"
              schema={updateProductSchema}
              productId={productDetails._id}
            />
          </CardContent>
        </Card>
      </div>
    )
  );
};

export default UpdateProduct;
