export interface Product {
  id: number;
  barcode: number;
  name: string;
  imgKey: string;
  category: string;
  itemsPerPackage: number;
  weight: number;
  description: String;
}


export interface ProductWithAmount {
  id: number;
  barcode: number;
  name: string;
  imgKey: string;
  category: string;
  itemsPerPackage: number;
  weight: number;
  description: String;
  amount: number;
}