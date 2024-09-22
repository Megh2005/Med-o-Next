import { ProductData } from "@/lib/interfaces/Product";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductSearchResult = ({ product }: { product: ProductData }) => {
  const [packInfo, setPackInfo] = useState<string>("");

  useEffect(() => {
    let info = "";
    switch (product.dosageForm) {
      case "tablet":
        info = `Strip of ${product.packSize} tablets`;
        break;
      case "capsule":
        info = `Strip of ${product.packSize} capsules`;
        break;
      case "syrup":
        info = `Bottle of ${product.packSize} ml syrup`;
        break;
      case "injection":
        info = `Vial of ${product.packSize} ml injection`;
        break;
      case "ointment":
        info = `Tube of ${product.packSize} gm ointment`;
        break;
      default:
        info = "";
    }
    setPackInfo(info);
  }, [product.dosageForm, product.packSize]);

  return (
    <Link to={`/u/product/${product._id}`}>
      <div className="rounded-lg bg-background shadow-md">
        <img
          src={product.imageUrl}
          alt={product.name}
          width={300}
          height={200}
          className="h-48 w-full rounded-t-lg object-cover"
          style={{ aspectRatio: "300/200", objectFit: "cover" }}
        />
        <div className="p-4">
          <h3 className="mb-1 text-lg font-bold line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm mb-1 text-muted-foreground line-clamp-1">
            {product.manufacturer}
          </p>
          <p className="text-sm mb-1 text-muted-foreground line-clamp-1">
            {product.genericName}
          </p>
          <p className="text-sm mb-4 text-muted-foreground">{packInfo}</p>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-black font-bold">₹{product.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductSearchResult;
