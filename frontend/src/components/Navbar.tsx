import { BACKEND_URL } from "@/utils/constants";
import axios from "axios";
import { ShoppingCartIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await axios.post(`${BACKEND_URL}/api/v1/auth/check-admin`, {
          token: localStorage.getItem("med-o-shop-token"),
        });

        if (res.data.success) {
          setIsAdmin(res.data.data.isAdmin);
        }
      } catch (error) {
        console.error(error);
      }
    }

    checkAdmin();
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <Link
          to="/u/home"
          className="text-xl lg:text-2xl font-bold text-primary"
        >
          Med-o-Shop
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {isAdmin && (
            <Link to="/admin" className="text-gray-600 hover:text-primary">
              Admin Panel
            </Link>
          )}
        </nav>
        <div className="flex items-center space-x-4">
          <Link to="/u/cart" className="text-gray-600 hover:text-primary">
            <ShoppingCartIcon className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
