import { useProductsContext } from "../context/ProductContext";

export const useProducts = () => {
  return useProductsContext();
};