export const getProductsFromLocalStorage = async () => {
  return new Promise((resolve) => {
    const data = localStorage.getItem("products");
    resolve(data ? JSON.parse(data) : []);
  });
};

export const setProductsToLocalStorage = async (products) => {
  return new Promise((resolve) => {
    localStorage.setItem("products", JSON.stringify(products));
    resolve();
  });
};
