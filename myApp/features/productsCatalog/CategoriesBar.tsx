import { AllCategories } from "../../domain/core/AllCategories";
import "./style/productCatalog.css";

const CategoriesBar = () => {
  return (
    <div className="categories-bar">
      {AllCategories.map((category) => (
        <div className="category-item" key={category.id}>
          <img
            src={category.iconUrl}
            alt={category.name}
            className="category-icon"
          />
          <div className="category-name">{category.name}</div>
        </div>
      ))}
    </div>
  );
};

export default CategoriesBar;
