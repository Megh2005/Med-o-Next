import SearchInput from "./SearchInput";
import bg from "../../public/bg.jpeg";

const HeroSection = () => {
  return (
    <section className="relative bg-gray-100 py-12 md:py-16 lg:py-20">
      <div className="absolute inset-0">
        <img
          className="w-full bg-cover h-full -z-40 brightness-75"
          src={bg}
          alt=""
        />
      </div>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-center text-balance text-3xl md:text-4xl font-bold mb-4">
              Welcome to <span className="text-primary">Med-o-Shop</span>
            </h1>
            <p className="text-center text-balance text-gray-600 mb-6">
              Discover a wide range of healthcare products and services at your
              fingertips.
            </p>
            <div className="flex justify-center space-x-4">
              <SearchInput />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
