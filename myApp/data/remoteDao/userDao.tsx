import { doc, getDoc } from "firebase/firestore";
import { db } from "../../backEnd/firebaseConfig";
import { User } from '../../domain/models/User';

export const fetchUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Failed to fetch user"
    );
  }
};
