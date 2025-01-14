import { Product } from "./Product";


export interface SummarizedProduct {
  productId: string;
  amount: number;
  usersAmounts: { userId: string; amount: number }[];
  product?: Product; // Optional, fetched from product collection
}
