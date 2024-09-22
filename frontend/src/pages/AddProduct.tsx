import ProductManageForm from "@/components/ProductManageForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { productSchema } from "@/lib/schemas/product.schema";

const AddProduct = () => {
  return (
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
            defaultFormValues={{ prescriptionRequired: false }}
            resourceAction="ADD"
            schema={productSchema}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
