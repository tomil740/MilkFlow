
export interface User {
  name: string;
  uid: string;
  distributerId: string | null;
  isDistributer: boolean;
  productsCollection:number[];
}
export interface AuthUser extends User {
  syncedAt?: number; // Timestamp for sync
}


