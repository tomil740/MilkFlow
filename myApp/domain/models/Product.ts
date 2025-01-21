export interface Product {
  id: number;
  barcode: number;
  name: string;
  imgUrl: string;
  category: string;
  itemsPerPackage: number;
  weight: number;
  isLiter: boolean;
  description: String;
}


export interface ProductWithAmount {
  id: number;
  barcode: number;
  name: string;
  imgUrl: string;
  category: string;
  itemsPerPackage: number;
  weight: number;
  isLiter: boolean;
  description: String;
  amount: number;
}