import { useRecoilState } from "recoil";
import { AllCategories } from "../../domain/core/AllCategories";
import { selectedCategoryState } from "../../domain/states/productsState";
import "../style/productCatalog.css";

function CategoriesBar() {
  const [selectedCategory, setSelectedCategory] = useRecoilState(selectedCategoryState);

  const handleCategoryClick = (category:string) => {
     // Toggle selected category
     setSelectedCategory((prev) => (prev === category ? "" : category));
   };

   return (
     <div className="categories-bar">
       {AllCategories.map((category) => (
         <div
           key={category.id}
           className={`category-item ${
             selectedCategory === category.name ? "selected" : ""
           }`}
           onClick={() => handleCategoryClick(category.name)}
         >
           <div className="category-name">{category.name}</div>
         </div>
       ))}
     </div>
   );
};

export default CategoriesBar;
