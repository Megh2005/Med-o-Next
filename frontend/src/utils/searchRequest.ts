import axios from "axios";
import { BACKEND_URL } from "./constants";

export async function handleSearch(data: {
  search: string | null;
  dosageForm?: string;
  sortBy?: string;
  sortOrder?: string;
  inStock?: boolean;
  category?: string;
}) {
  const {
    search,
    dosageForm = "",
    sortBy = "",
    sortOrder = "1",
    inStock = false,
    category = "",
  } = data;

  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/search?q=${search}&dosageForm=${dosageForm}&sortBy=${sortBy}&sortOrder=${parseInt(
        sortOrder
      )}&inStock=${inStock}&category=${category}`
    );
    return response.data.data?.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
