import { CartItem } from './CartItem';

export interface DemandItem {
  data: CartItem[];
  dateAndTime: string;
  status: "Pending" | "Approved" | "Rejected";
  totalCost: number;
}
