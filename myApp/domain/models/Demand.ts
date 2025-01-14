import { firestore } from "firebase/app";
import { CartItem } from './CartItem';


export interface Demand {
  demandId:string;
  userId: string;
  distributerId: string | null;
  status: "pending" | "placed" | "completed";
  createdAt: firestore.FieldValue;
  updatedAt: firestore.FieldValue;
  products: CartItem[];
}
