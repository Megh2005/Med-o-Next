import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col items-center justify-center">
        <h1 className="text-lg font-semibold">Ordered Successfully</h1>
        <Link to={"/u/home"}>
          <Button className="m-4">Go to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
