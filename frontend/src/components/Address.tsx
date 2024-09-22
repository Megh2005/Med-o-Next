import { Address as address } from "@/lib/interfaces/Address";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MouseEventHandler } from "react";
import { Check } from "lucide-react";

const Address = ({
  address,
  index,
  selected,
  onClickHandler,
}: {
  address: address;
  index: number;
  selected: boolean;
  onClickHandler: MouseEventHandler;
}) => {
  const transformStateName = (state: string) => {
    if (state.includes("_")) {
      return state
        .split("_")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }
  };

  return (
    <Card className="cursor-pointer" onClick={onClickHandler}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Address {index + 1}
          {selected && <Check className="w-5 h-5 text-primary" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-sm">{address.fullName}</h3>
        <p className="text-sm">
          {address.houseNumber}, {address.street}, {address.landmark}
        </p>
        <p className="text-sm">
          {address.city}, {transformStateName(address.state)}, {address.pincode}
        </p>
        <p className="text-sm">{address.phoneNumber}</p>
      </CardContent>
    </Card>
  );
};

export default Address;
