import { CartData } from "./Cart";
import { ProductData } from "./Product";

export interface RootState {
  search: {
    query: string;
    results: ProductData[];
    loading: boolean;
  };
  filter: {
    filter: {
      dosageForm?: string;
      sortBy?: string;
      sortOrder?: string;
      inStock?: boolean;
      category: string;
    };
  };
  cart: {
    cartItems: Record<string, CartData>;
    subTotal: number;
    totalItems: number;
  };
}
