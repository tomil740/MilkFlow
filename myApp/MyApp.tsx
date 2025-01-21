import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { router } from "./router/Router";
import { createDistributorUsers } from "./data/adminFunctions/createDistributorCustomers";
import { updateCustomerProductsCollection } from "./data/adminFunctions/updateCustomerProductsCollection";
import { replaceProductsCollection } from "./data/adminFunctions/productsInsert";
import { Product } from './domain/models/Product';


export default function MyApp() {
  //admin actions:

  //create users:
  /*
const storeNames: string[] = [
  "שופרסלדיל",
  "שופרסלשלי",
  "שופרסלאקספרס",
  "שופרסלאוןליין",
];

const a = createDistributorUsers(storeNames, "mduD3xb6VAX7kDUJdL8Fv1bo6Fp1");
console.log("The new accounts",a)
for(const b in a){
  console.log(b)
}
  */


//user products catalog:
/*
const numbers1: number[] = [
  90108, 90109, 90112, 90106, 80108, 90110, 90116, 80104, 91110, 91144, 91102,
  91118, 91134, 80209, 80201, 80611, 80601, 80636, 80622, 80618, 80710, 80701,
  80713, 80721, 80509, 80502, 80516, 80505, 80519, 80520, 90953, 90952, 80511,
  80513, 90802, 90811, 80301, 80310, 80405, 80635, 80605, 80305, 80302, 81103,
  91342, 91309, 91306, 80621, 80670, 91101, 91124, 91314, 91112, 91141, 91143,
  81102, 91132, 80807, 81010, 91004, 91103, 91115, 90812, 90805, 90810, 91154,
  80409, 80402, 80404, 80406, 91218, 90903, 90906,
];
const superSalExper = {
  name: "שופרסלאקספרס",
  productsCollection: numbers1,
};

const numbers2: number[] = [
  90108, 90109, 90112, 90106, 80108, 90110, 90116, 80104, 91110, 91144, 91102,
  91118, 91134, 80209, 80201, 80611, 80601, 80636, 80622, 80618, 80710, 80701,
  80713, 80714, 80721, 80509, 80502, 80516, 80505, 80519, 80520, 90953, 90952,
  80511, 80513, 90802, 90811, 80301, 80310, 80405, 80635, 80605, 80305, 80302,
  81103, 91342, 91309, 91306, 80621, 80670, 91101, 91124, 91314, 91112, 91141,
  91143, 81102, 91132, 80807, 81010, 91004, 91103, 91115, 90812, 90805, 90810,
  91154, 80409, 80402, 80404, 80406, 91218, 90903, 90906,
];
const superSalDeal = {
  name: "שופרסלדיל",
  productsCollection: numbers2,
};

const numbers3: number[] = [
  90108, 90109, 90112, 90106, 80108, 90110, 90116, 80104, 91110, 91144, 91102,
  91118, 91134, 80209, 80201, 80611, 80601, 80636, 80622, 80618, 80710, 80701,
  80713, 80714, 80721, 80509, 80502, 80516, 80505, 80519, 80520, 90953, 90952,
  80511, 80513, 90802, 90811, 80301, 80310, 80405, 80635, 80605, 80305, 80302,
  81103, 91342, 91309, 91306, 80621, 80670, 91101, 91124, 91314, 91112, 91141,
  91143, 81102, 91132, 80807, 81010, 91004, 91103, 91115, 90812, 90805, 91154,
  80409, 80402, 80404, 80406,
];



const superSalMy = {
  name: "שופרסלשלי",
  productsCollection: numbers3,
};

updateCustomerProductsCollection([superSalDeal,superSalExper,superSalMy])
*/

//init products collection:
/*
const initProducts: Product[] = [
  {
    id: 90108,
    barcode: 7290011499105,
    name: "בולגרית מסורתית 5%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2018/04/h6810327_550x55023.png",
    category: "בולגריות",
    itemsPerPackage: 6,
    weight: 250,
    isLiter: false,
    description: "תיאור אקראי מתאים",
  },
  {
    id: 90198,
    barcode: 7290011499730,
    name: "בולגרית מסורתית 5% מהדרין",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2024/12/%D7%A1%D7%97%D7%A8-%D7%A9%D7%9E%D7%A0%D7%AA-%D7%9B%D7%9E%D7%94%D7%99%D7%9F-24-450x450.png",
    category: "בולגריות",
    itemsPerPackage: 6,
    weight: 250,
    isLiter: false,
    description: "תיאור אקראי מתאים",
  },
  {
    id: 90109,
    barcode: 7290011499112,
    name: "בולגרית מסורתית 16%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2022/06/30056-13-a_pic_site_6-e1654600301407.png",
    category: "בולגריות",
    itemsPerPackage: 6,
    weight: 250,
    isLiter: false,
    description: "תיאור אקראי מתאים",
  },
  {
    id: 90112,
    barcode: 7290011499327,
    name: "בולגרית מעודנת 5%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2018/04/h6810327_550x55023.png",
    category: "בולגריות",
    itemsPerPackage: 6,
    weight: 250,
    isLiter: false,
    description: "תיאור אקראי מתאים",
  },
  {
    id: 90197,
    barcode: 7290011499822,
    name: "בולגרית מעודנת 5%  מהדרין",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2024/12/%D7%A1%D7%97%D7%A8-%D7%A9%D7%9E%D7%A0%D7%AA-%D7%9B%D7%9E%D7%94%D7%99%D7%9F-24-450x450.png",
    category: "בולגריות",
    itemsPerPackage: 6,
    weight: 250,
    isLiter: false,
    description: "תיאור אקראי מתאים",
  },
  {
    id: 90106,
    barcode: 7290017065236,
    name: "בולגרית מעודנת  24%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2022/06/30056-13-a_pic_site_6-e1654600301407.png",
    category: "בולגריות",
    itemsPerPackage: 6,
    weight: 250,
    isLiter: false,
    description: "תיאור אקראי מתאים",
  },
  {
    id: 80108,
    barcode: 7290006492616,
    name: "פרוסות בולגרית מעודנת 5%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2018/04/h6810327_550x55023.png",
    category: "בולגריות",
    itemsPerPackage: 6,
    weight: 250,
    isLiter: false,
    description: "תיאור אקראי מתאים",
  },
  {
    id: 80198,
    barcode: 7290011499723,
    name: "פרוסות בולגרית מהדרין 5%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2024/12/%D7%A1%D7%97%D7%A8-%D7%A9%D7%9E%D7%A0%D7%AA-%D7%9B%D7%9E%D7%94%D7%99%D7%9F-24-450x450.png",
    category: "בולגריות",
    itemsPerPackage: 6,
    weight: 250,
    isLiter: false,
    description: "תיאור אקראי מתאים",
  },
  {
    id: 90110,
    barcode: 7290011499129,
    name: "קוביות בולגרית מעודנת  5%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2022/06/30056-13-a_pic_site_6-e1654600301407.png",
    category: "בולגריות",
    itemsPerPackage: 6,
    weight: 200,
    isLiter: false,
    description: "תיאור אקראי מתאים",
  },
  {
    id: 90116,
    barcode: 7290019635222,
    name: "קוביות בולגרית מעודנת 16%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2018/04/h6810327_550x55023.png",
    category: "בולגריות",
    itemsPerPackage: 6,
    weight: 200,
    isLiter: false,
    description: "תיאור אקראי מתאים",
  },
  {
    id: 80104,
    barcode: 7290005992575,
    name: "בולגרית למריחה 5%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2024/12/%D7%A1%D7%97%D7%A8-%D7%A9%D7%9E%D7%A0%D7%AA-%D7%9B%D7%9E%D7%94%D7%99%D7%9F-24-450x450.png",
    category: "בולגריות",
    itemsPerPackage: 12,
    weight: 250,
    isLiter: false,
    description: "תיאור אקראי מתאים",
  },
  {
    id: 91144,
    barcode: 7290011499303,
    name: "פטה עיזים מעודנת 5%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2022/06/30056-13-a_pic_site_6-e1654600301407.png",
    category: "פטה",
    itemsPerPackage: 6,
    weight: 250,
    isLiter: false,
    description: "תיאור אקראי מתאים",
  },
  {
    id: 91102,
    barcode: 7290017065663,
    name: "פטה עיזים מעודנת 16%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2018/04/h6810327_550x55023.png",
    category: "פטה",
    itemsPerPackage: 6,
    weight: 250,
    isLiter: false,
    description: "תיאור אקראי מתאים",
  },
  {
    id: 90115,
    barcode: 7290011499204,
    name: "גבינה צפתית 5%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2018/04/safed_cheese_5_percent.png",
    category: "צפתיות",
    itemsPerPackage: 8,
    weight: 200,
    isLiter: false,
    description: "גבינה צפתית קלילה ומעודנת, מתאימה לסלטים.",
  },
  {
    id: 90118,
    barcode: 7290011499211,
    name: "גבינה צפתית 9%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2018/04/safed_cheese_9_percent.png",
    category: "צפתיות",
    itemsPerPackage: 8,
    weight: 200,
    isLiter: false,
    description: "גבינה צפתית עשירה בטעמים ובמרקם ייחודי.",
  },
  {
    id: 90201,
    barcode: 7290011499939,
    name: "קממבר מסורתית 24%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2024/12/camembert_cheese.png",
    category: "גבינות עובש",
    itemsPerPackage: 4,
    weight: 150,
    isLiter: false,
    description: "קממבר עשירה ואיכותית עם ארומה ייחודית.",
  },
  {
    id: 90205,
    barcode: 7290011499946,
    name: "ברי עם כמהין 24%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2024/12/brie_truffle_cheese.png",
    category: "גבינות עובש",
    itemsPerPackage: 4,
    weight: 150,
    isLiter: false,
    description: "ברי עשירה בשילוב כמהין טבעי.",
  },
  {
    id: 90210,
    barcode: 7290011499953,
    name: "פסטו ממרח גבינה",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2018/04/pesto_spread.png",
    category: "ממרחים",
    itemsPerPackage: 12,
    weight: 250,
    isLiter: false,
    description: "ממרח גבינה עשיר בטעם פסטו איטלקי.",
  },
  {
    id: 90213,
    barcode: 7290011499960,
    name: "עגבניות מיובשות ממרח גבינה",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2018/04/sundried_tomato_spread.png",
    category: "ממרחים",
    itemsPerPackage: 12,
    weight: 250,
    isLiter: false,
    description: "ממרח גבינה בטעם עגבניות מיובשות.",
  },
  {
    id: 90220,
    barcode: 7290011499977,
    name: "לאבנה עיזים 9%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2024/12/goat_labneh.png",
    category: "לאבנה",
    itemsPerPackage: 6,
    weight: 250,
    isLiter: false,
    description: "לאבנה עיזים עשירה בטעם חמצמץ קל.",
  },
  {
    id: 90225,
    barcode: 7290011499984,
    name: "לאבנה עיזים עם זעתר 5%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2024/12/goat_labneh_zaatar.png",
    category: "לאבנה",
    itemsPerPackage: 6,
    weight: 250,
    isLiter: false,
    description: "לאבנה עיזים בתוספת זעתר ארומטי.",
  },
  {
    id: 90230,
    barcode: 7290011499991,
    name: "מוצרלה מגוררת 22%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2018/04/shredded_mozzarella.png",
    category: "גבינות מגוררות",
    itemsPerPackage: 10,
    weight: 500,
    isLiter: false,
    description: "מוצרלה מגוררת, מעולה לפיצות ולמאפים.",
  },
  {
    id: 90235,
    barcode: 7290011500001,
    name: "אדום גורמה 16%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2018/04/gourmet_red_cheese.png",
    category: "גורמה",
    itemsPerPackage: 5,
    weight: 300,
    isLiter: false,
    description: "גבינה אדומה גורמה עם טעם עז ומיוחד.",
  },
  {
    id: 90240,
    barcode: 7290011500018,
    name: "צהובה מעודנת 22%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2018/04/yellow_cheese.png",
    category: "צהובות",
    itemsPerPackage: 10,
    weight: 400,
    isLiter: false,
    description: "גבינה צהובה קלאסית בטעם עדין.",
  },
  {
    id: 90245,
    barcode: 7290011500025,
    name: "גבינת שמנת 24%",
    imgUrl:
      "https://www.gad-dairy.co.il/wp-content/uploads/2024/12/cream_cheese.png",
    category: "שמנת",
    itemsPerPackage: 8,
    weight: 300,
    isLiter: false,
    description: "גבינת שמנת עשירה וקלאסית.",
  },
];


replaceProductsCollection(initProducts);
*/
  return (
    <RecoilRoot>
      <>
        <RouterProvider router={router} />
      </>
    </RecoilRoot>
  );
}
