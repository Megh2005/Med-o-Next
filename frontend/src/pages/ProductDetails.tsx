import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductData } from "@/lib/interfaces/Product";

import { addItemToCart } from "@/lib/redux/slices/cartSlice";
import { BACKEND_URL } from "@/utils/constants";
import axios from "axios";
import { ShoppingCartIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductData | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;
    async function fetchProductDetails() {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/product/${id}`);

        if (response.data.success) {
          setProduct(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchProductDetails();
  }, [id]);

  const addToCart = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/cart`,
        {
          productId: id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("med-o-shop-token")}`,
          },
        }
      );

      if (response.data.success) {
        if (response.data.status === 200) {
          toast.success("Product already exists in cart");
        } else {
          toast.success("Added to cart");
          dispatch(addItemToCart(response.data.data));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) return null;

  return (
    <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
      <div className="grid gap-4 md:gap-10 items-start">
        <img
          src={product.imageUrl}
          alt="Product Image"
          width={600}
          height={600}
          className="aspect-square object-cover border w-full rounded-lg overflow-hidden"
        />
        <div className="grid gap-4 md:gap-10">
          <div className="grid gap-1">
            <Button onClick={addToCart} className="flex items-center gap-2">
              <span>Add to cart</span>
              <ShoppingCartIcon className="w-4 h-4 text-white" />
            </Button>
          </div>
          <div className="grid gap-1">
            <h1 className="font-bold text-3xl">{product.name}</h1>
            <p className="text-muted-foreground">{product.genericName}</p>
            <p className="text-muted-foreground">
              Manufactured by {product.manufacturer}
            </p>
          </div>
          <div className="grid gap-2 text-sm leading-loose">
            <p>{product.description}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:gap-10 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-muted-foreground">Category:</div>
              <div>{product.category}</div>
              <div className="text-muted-foreground">Dosage Form:</div>
              <div>{product.dosageForm}</div>
              <div className="text-muted-foreground">Strength:</div>
              <div>{product.strength}</div>
              <div className="text-muted-foreground">Pack Size:</div>
              <div>{product.packSize}</div>
              <div className="text-muted-foreground">Price:</div>
              <div>₹{product.price}</div>
              <div className="text-muted-foreground">
                Prescription Required:
              </div>
              <div>{product.prescriptionRequired ? "Yes" : "No"}</div>
              <div className="text-muted-foreground">In Stock:</div>
              <div>{product.stock > 0 ? "In stock" : "Out of stock"}</div>
              <div className="text-muted-foreground">Expiry Date:</div>
              <div>{product.expiryDate.toString()}</div>
              <div className="text-muted-foreground">Manufactured Date:</div>
              <div>{product.manufacturedDate.toString()}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Ingredients</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div>
              <div className="font-medium">{product.genericName}</div>
              <p className="text-sm text-muted-foreground">
                {product.activeIngredients}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Instructions for Use</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div>
              <p>{product.instructions}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;
