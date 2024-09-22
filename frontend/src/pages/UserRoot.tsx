import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const UserRoot = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default UserRoot;
