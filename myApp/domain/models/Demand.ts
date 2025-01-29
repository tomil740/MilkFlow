import { CartItem } from './CartItem';


export interface Demand {
  id:string;
  userId: string;
  distributerId: string | null;
  status: "pending" | "placed" | "completed";
  createdAt: Date;
  updatedAt: Date;
  products: CartItem[];
}

export interface DemandToPush {
  userId: string;
  distributerId: string | null;
  status: "pending" | "placed" | "completed";
  createdAt: Date;
  updatedAt: Date;
  products: CartItem[];
}
