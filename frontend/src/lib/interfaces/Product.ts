export interface Product {
  name: string;
  genericName: string;
  manufacturer: string;
  description: string;
  category: string;
  dosageForm: string;
  strength: string;
  packSize: number;
  price: string;
  prescriptionRequired: boolean;
  stock: number;
  expiryDate: Date;
  manufacturedDate: Date;
  batchNumber: string;
  activeIngredients: string;
  instructions: string;
  imageUrl: string;
}

export interface ProductData extends Product {
  _id: string;
}
