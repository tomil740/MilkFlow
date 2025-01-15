export interface Product {
  id: string;
  name: string;
  price: number; 
  imgUrl: string;
  category: string;
  description: String;
}


export interface ProductWithAmount {
  id: string;
  name: string;
  price: number;
  imgUrl: string;
  category: string;
  description: String;
  amount:Number;
}