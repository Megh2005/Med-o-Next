import { TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import { CartData } from "@/lib/interfaces/Cart";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/interfaces/RootState";
import {
  decreaseQuantityByOne,
  increaseQuantityByOne,
  removeFromCart,
} from "@/lib/redux/slices/cartSlice";
import axios from "axios";
import { BACKEND_URL } from "@/utils/constants";

const CartItem = ({ data }: { data: CartData }) => {
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const increaseQuantity = async () => {
    await axios.put(
      `${BACKEND_URL}/api/v1/cart/increase-item`,
      {
        productId: data.product._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("med-o-shop-token")}`,
        },
      }
    );
    dispatch(increaseQuantityByOne(data));
  };

  const decreaseQuantity = async () => {
    await axios.put(
      `${BACKEND_URL}/api/v1/cart/decrease-item`,
      {
        productId: data.product._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("med-o-shop-token")}`,
        },
      }
    );
    dispatch(decreaseQuantityByOne(data));
  };

  const removeItem = async () => {
    await axios.delete(
      `${BACKEND_URL}/api/v1/cart/remove-item/${data.product._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("med-o-shop-token")}`,
        },
      }
    );
    dispatch(removeFromCart(data));
  };

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-4">
        <img
          src={data.product.imageUrl}
          alt="Product Image"
          width={64}
          height={64}
          className="rounded-md object-cover"
          style={{ aspectRatio: "64/64", objectFit: "cover" }}
        />
        <div className="grid gap-1">
          <h3 className="font-medium">{data.product.name}</h3>
          <p className="text-sm text-muted-foreground">
            {data.product.genericName}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="font-medium">₹{data.product.price}</div>
          <div className="flex items-center gap-2">
            <Button onClick={decreaseQuantity} variant="outline" size="sm">
              -
            </Button>
            <span>{cartItems[data.product._id].quantity}</span>
            <Button onClick={increaseQuantity} variant="outline" size="sm">
              +
            </Button>
          </div>
        </div>
        <Button
          onClick={removeItem}
          variant="ghost"
          size="icon"
          className="ml-auto"
        >
          <TrashIcon className="h-5 w-5" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
