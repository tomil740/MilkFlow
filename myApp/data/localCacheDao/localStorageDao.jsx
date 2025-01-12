
//const productsKey = "products";
//const CartKey = "products";

export async function getFromLocalStorage(key){
  return new Promise((resolve) => {
    const data = localStorage.getItem(key);
    resolve(data ? JSON.parse(data) : []);
  });
};

export async function setToLocalStorage(key,object){
  return new Promise((resolve) => {
    localStorage.setItem(key, JSON.stringify(object));
    resolve();
  });
};
