import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold">Med-o-Shop</h1>
        <Link to={"/signup"}>
          <Button className="m-4">Start shopping</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
