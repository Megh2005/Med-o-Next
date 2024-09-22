import { Button } from "@/components/ui/button";
import { OrderInfo } from "@/lib/interfaces/Order";
import { BACKEND_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PlaceOrder = () => {
  const router = useNavigate();
  const [searchParam] = useSearchParams();
  const addressId = new URLSearchParams(searchParam).get("address_id");
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);

  useEffect(() => {
    if (!addressId) return;
    getCartInfo();
  }, [addressId]);

  async function getCartInfo() {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/order`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("med-o-shop-token")}`,
        },
      });

      if (response.data.success) {
        setOrderInfo({
          address: addressId!,
          items: response.data.data.items,
          orderedBy: response.data.data.orderedBy,
          total: response.data.data.total,
          status: "pending",
          phoneNumber: response.data.data.phoneNumber,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const placeOrder = async () => {
    if (!orderInfo) return;

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/order`,
        { orderInfo },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("med-o-shop-token")}`,
          },
        }
      );

      if (response.data.success) {
        router("/payment/success");
      }
    } catch {
      router("/payment/failure");
    }
  };

  return (
    <div>
      <Button
        onClick={placeOrder}
        disabled={orderInfo ? false : true}
        className="m-4"
      >
        Place Order
      </Button>
    </div>
  );
};

export default PlaceOrder;
