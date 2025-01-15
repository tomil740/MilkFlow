import { useState, useEffect } from "react";
import {SummarizedProduct } from "../models/SummarizedProduct";
import useProducts from './useProducts';
import { Demand } from '../models/Demand';
import { CartItem } from '../models/CartItem';


export const useDemandsByProducts = (demands: Demand[]) => {
  const [data, setData] = useState<SummarizedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { products, fetchProducts } = useProducts();


  useEffect(() => {
    const summarizeDemandsByProducts = async () => {
      try {
        await fetchProducts()
        // Step 1: Group demands by productId
        const groupedProducts: Record<string, SummarizedProduct> = {};

        for (const demand of demands) {
          const { userId, products } = demand;

          products.forEach((cartItem: CartItem) => {
            const { productId, amount } = cartItem;

            if (!groupedProducts[productId]) {
              groupedProducts[productId] = {
                productId,
                amount: 0,
                usersAmounts: [],
              };
            }

            groupedProducts[productId].amount += amount;

            const existingUser = groupedProducts[productId].usersAmounts.find(
              (user) => user.userId === userId
            );

            if (existingUser) {
              existingUser.amount += amount;
            } else {
              groupedProducts[productId].usersAmounts.push({
                userId,
                amount,
              });
            }
          });
        } 

        // Convert grouped data into an array
        const productsSummary = Object.values(groupedProducts);

        // Step 2: Fetch product details and enrich the data
        const enrichedData = productsSummary.map((item) => ({ 
          ...item,
          product: products.find((p) => p.id === item.productId),
        }));

        // Step 3: Sort by total amount (newest first)
        enrichedData.sort((a, b) => b.amount - a.amount);

        setData(enrichedData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    summarizeDemandsByProducts();
  }, [demands]);

  return { loading, error, data };
};