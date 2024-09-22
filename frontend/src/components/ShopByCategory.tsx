import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

const ShopByCategory = () => {
  return (
    <section id="categories" className="py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-600">
            Explore our wide range of healthcare products by category.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <Link to="#">
            <Card>
              <CardHeader>
                {" "}
                <h3 className="text-lg font-medium mb-2">Vitamins</h3>
              </CardHeader>
              <CardContent className="flex justify-center">
                <img
                  width={200}
                  height={200}
                  src="https://res.cloudinary.com/dutdeodcv/image/upload/v1724491894/med-o-next/category_images/drrwibcmqj9nvgxqnpi5.png"
                  alt="Vitamins"
                />
              </CardContent>
              <CardFooter>
                <p className="text-gray-600">Boost your overall health</p>
              </CardFooter>
            </Card>
          </Link>
          <Link
            to="#"
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <Card>
              <CardHeader>
                {" "}
                <h3 className="text-lg font-medium mb-2">Women Hygiene</h3>
              </CardHeader>
              <CardContent className="flex justify-center">
                <img
                  width={200}
                  height={200}
                  src="https://res.cloudinary.com/dutdeodcv/image/upload/v1724481026/med-o-next/category_images/dg6oxpmtme4b3bvhjwxu.png"
                  alt="Skin care"
                />
              </CardContent>
              <CardFooter>
                <p className="text-gray-600">
                  Shop essential women's hygiene products
                </p>
              </CardFooter>
            </Card>
          </Link>
          <Link
            to="#"
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <Card>
              <CardHeader>
                {" "}
                <h3 className="text-lg font-medium mb-2">Antibiotics</h3>
              </CardHeader>
              <CardContent className="flex justify-center">
                <img
                  width={200}
                  height={200}
                  src="https://res.cloudinary.com/dutdeodcv/image/upload/v1724493416/med-o-next/category_images/o8j2jxc6olmqydtueqhd.png"
                  alt="Vitamins"
                />
              </CardContent>
              <CardFooter>
                <p className="text-gray-600">
                  Effective solutions to combat bacterial infections and promote
                  health
                </p>
              </CardFooter>
            </Card>
          </Link>
          <Link
            to="#"
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <Card>
              <CardHeader>
                {" "}
                <h3 className="text-lg font-medium mb-2">Others</h3>
              </CardHeader>
              <CardContent className="flex justify-center">
                <img
                  width={200}
                  height={200}
                  src="https://res.cloudinary.com/dutdeodcv/image/upload/v1724491726/med-o-next/category_images/aslu6mkyhnugcvh8eqbu.png"
                  alt="Vitamins"
                />
              </CardContent>
              <CardFooter>
                <p className="text-gray-600">More products</p>
              </CardFooter>
            </Card>
          </Link>
        </div>
        <p className="my-4 text-center font-medium text-lg">And more</p>
      </div>
    </section>
  );
};

export default ShopByCategory;
