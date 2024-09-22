import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { ProductData } from "@/lib/interfaces/Product";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "@/utils/constants";

const ProductAdminItem = ({
  product,
  productList,
  setProductList,
}: {
  product: ProductData;
  productList: ProductData[];
  setProductList: any;
}) => {
  async function deleteProduct() {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/api/v1/admin/delete-product/${product._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("med-o-shop-token")}`,
          },
        }
      );

      if (response.data.success) {
        const updatedList = productList.filter(
          (item) => item._id !== product._id
        );
        setProductList(updatedList);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message, {
          duration: 3000,
          position: "top-center",
        });
      } else {
        toast.error("Something went wrong. Please try again", {
          duration: 3000,
          position: "top-center",
        });
      }
    }
  }

  return (
    <div className="col-span-6 grid grid-cols-6 bg-gray-50 p-4 rounded-sm">
      <div>{product.name}</div>
      <div className="col-span-2">{product.manufacturer}</div>
      <div>₹{product.price}</div>
      <div>{product.stock}</div>
      <div className="flex justify-self-end">
        <Link to={`/admin/update-product/${product._id}`}>
          <Button variant="outline" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-2" variant="destructive" size="icon">
              <Trash2 className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the
                product
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={deleteProduct}
                type="submit"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProductAdminItem;
