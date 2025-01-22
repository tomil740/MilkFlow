import { auth, db } from "../../backEnd/firebaseConfig"; // Adjust paths as needed
import { createUserWithEmailAndPassword } from "firebase/auth";
import{ doc, getDoc, setDoc, runTransaction } from "firebase/firestore";

export const createDistributorUsers = async (
  nameCollection: string[],
  distributerId: string
): Promise<{ name: string; email: string }[]> => {
  const results: { name: string; email: string }[] = [];

  for (const name of nameCollection) {
    try {
      console.log(
        `[INFO] Processing user "${name}" with distributerId "${distributerId}"`
      );
      const user = await createDistributorUser(name, distributerId);
      if (user) {
        results.push(user);
        console.log(`[SUCCESS] Created or found user: ${JSON.stringify(user)}`);
      }
    } catch (error: any) {
      console.error(
        `[ERROR] Failed to process user "${name}": ${error.message}`
      );
    }
  }

  return results;
};




const createDistributorUser = async (name: string, distributerId: string) => {
  const defaultPassword = "1234567";

  try {
    // Step 1: Translate the Hebrew name into English
    const emailBase = generateEmailBase(name);
    const email = `${emailBase}@mail.com`;

    console.log(`[INFO] Translating name "${name}" to "${emailBase}"`);

    // Step 2: Begin transaction to check for email and name duplication
    const userDocRef = doc(db, "users", email);

    // Check if the email already exists in Firestore
    const existingUserDoc = await getDoc(userDocRef);

    if (existingUserDoc.exists()) {
      console.warn(`[WARN] User with email "${email}" already exists.`);
      const existingUserData = existingUserDoc.data();
      return {
        name: existingUserData.name,
        email: existingUserData.email,
      };
    }

    // Step 3: Proceed with user creation in a transaction
    console.log(`[INFO] Creating new user: ${name} (${email})`);
    const newUserData = {
      name,
      email,
      distributerId,
      uid: "null", // Placeholder for UID to be set after auth creation
      isDistributer: false,
      productsCollection: [90108],
    };

    // Start a transaction for user creation
    await runTransaction(db, async (transaction) => {
      // Check if email exists again before user creation (ensure no race condition)
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        console.warn(
          `[WARN] Duplicate user detected during transaction. User already exists.`
        );
        throw new Error("User already exists");
      }

      // Create Firebase Authentication User
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        defaultPassword
      );
      newUserData.uid = firebaseUser.uid;

      // Save the user object in Firestore
      transaction.set(doc(db, "users", firebaseUser.uid), newUserData);
    });

    console.log(`[SUCCESS] Created new user: ${name} (${email})`);
    return {
      name: newUserData.name,
      email: newUserData.email,
    };
  } catch (error: any) {
    console.error(`[ERROR] Failed to create user "${name}": ${error.message}`);
    throw error;
  }
};




const hebrewToEnglishMap: { [key: string]: string } = {
  א: "a",
  ב: "b",
  ג: "g",
  ד: "d",
  ה: "h",
  ו: "v",
  ז: "z",
  ח: "ch",
  ט: "t",
  י: "y",
  כ: "k",
  ל: "l",
  מ: "m",
  נ: "n",
  ס: "s",
  ע: "e",
  פ: "p",
  צ: "tz",
  ק: "k",
  ר: "r",
  ש: "sh",
  ת: "t",
};

const customTransliterate = (name: string): string =>
  name
    .split("")
    .map((char) => hebrewToEnglishMap[char] || ".")
    .join("");

// Example usage for generating email base
const generateEmailBase = (name: string): string => {
  const transliterated = customTransliterate(name);
  return transliterated;
};
