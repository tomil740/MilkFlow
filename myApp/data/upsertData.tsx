import { doc, setDoc } from "firebase/firestore";
import { db } from "../backEnd/firebaseConfig";

/**
 * Add or update a list of products in the Firestore collection.
 * @param {Array<Object>} products - Array of product objects to add/update.
 */
export const upsertProducts = async (products) => {
  try {
    const promises = products.map((product) => {
      const productRef = doc(db, "products", product.id); // 'products' is your collection name
      return setDoc(productRef, product); // setDoc will add or overwrite the document
    });

    await Promise.all(promises); // Run all operations concurrently
    console.log(`Successfully added/updated ${products.length} products.`);
  } catch (error) {
    console.error("Error adding/updating products:", error);
    throw error;
  }
};

const products1 = [
  {
    id: "1",
    name: "גבינת שמנת ניו יורק 5%",
    price: 12.9,
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2018/04/h6810327_550x55023.png",
    category: "גבינות שמנת",
    description:
      "גבינת שמנת בסגנון ניו יורק, עשירה וקרמית, מושלמת למריחה על לחם.",
  },
  {
    id: "2",
    name: "קוטג' 5%",
    price: 7.5,
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2024/12/%D7%A1%D7%97%D7%A8-%D7%A9%D7%9E%D7%A0%D7%AA-%D7%9B%D7%9E%D7%94%D7%99%D7%9F-24-450x450.png",
    category: "מוצרי קוטג'",
    description: "קוטג' טרי עם 5% שומן, מתאים לכל המשפחה.",
  },
  {
    id: "3",
    name: "גבינת פטה עיזים 16%",
    price: 15.0,
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2022/06/30056-13-a_pic_site_6-e1654600301407.png",
    category: "גבינות מלוחות",
    description: "גבינת פטה מחלב עיזים, בעלת מרקם עדין וטעם ייחודי.",
  },
  {
    id: "4",
    name: "יוגורט עיזים 3%",
    price: 8.0,
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2018/04/h6810327_550x55023.png",
    category: "יוגורטים",
    description: "יוגורט עיזים טבעי ובריא, מתאים לארוחות בוקר או כתוספת.",
  },
  {
    id: "5",
    name: "גבינת מוצרלה מגוררת",
    price: 13.5,
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2024/12/%D7%A1%D7%97%D7%A8-%D7%A9%D7%9E%D7%A0%D7%AA-%D7%9B%D7%9E%D7%94%D7%99%D7%9F-24-450x450.png",
    category: "גבינות קשות",
    description: "גבינת מוצרלה מגוררת, מושלמת לפיצות ומאפים.",
  },
  {
    id: "6",
    name: "חמאה מלוחה 82%",
    price: 14.0,
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2022/06/30056-13-a_pic_site_6-e1654600301407.png",
    category: "חמאות",
    description: "חמאה מלוחה משובחת, מתאימה לאפייה ולמריחה.",
  },
  {
    id: "7",
    name: "גבינת בולגרית 5%",
    price: 11.9,
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2018/04/h6810327_550x55023.png",
    category: "גבינות מלוחות",
    description: "גבינה בולגרית מעודנת עם 5% שומן, מתאימה לסלטים ותבשילים.",
  },
  {
    id: "8",
    name: "שמנת מתוקה 38%",
    price: 9.5,
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2024/12/%D7%A1%D7%97%D7%A8-%D7%A9%D7%9E%D7%A0%D7%AA-%D7%9B%D7%9E%D7%94%D7%99%D7%9F-24-450x450.png",
    category: "שמנת",
    description: "שמנת מתוקה עשירה, מושלמת לקצפת וקינוחים.",
  },
];

export async function uploadProducts1(){
  try {
    await upsertProducts(products1);
    console.log("Products uploaded successfully.");
  } catch (error) {
    console.error("Error uploading products:", error);
  }
};

