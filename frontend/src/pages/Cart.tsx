import CartItem from "@/components/CartItem";
import { Button } from "@/components/ui/button";
import { CartData } from "@/lib/interfaces/Cart";
import axios from "axios";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/interfaces/RootState";
import { useEffect } from "react";
import { setCartItems } from "@/lib/redux/slices/cartSlice";

export default function CartPage() {
  const { cartItems, subTotal, totalItems } = useSelector(
    (state: RootState) => state.cart
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (Object.entries(cartItems).length !== 0) return;

    async function fetchCart() {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/cart`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("med-o-shop-token")}`,
          },
        });
        dispatch(setCartItems(response.data.data.products));
      } catch (error) {
        console.log(error);
      }
    }

    fetchCart();
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid gap-8">
        <div className="grid gap-4">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <div className="grid gap-4 mt-4">
            {Object.entries(cartItems).map(([key, value]) => (
              <CartItem key={key} data={value as CartData} />
            ))}
          </div>
        </div>
        <div className="grid gap-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium">Subtotal</p>
            <p className="text-lg font-medium">₹{subTotal.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium">Total Items</p>
            <p className="text-lg font-medium">{totalItems}</p>
          </div>
          {Object.entries(cartItems).length > 0 && (
            <Link to={"/u/cart/billing"}>
              <Button size="lg" className="w-full">
                Continue to Billing Address
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
