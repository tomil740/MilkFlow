import { useDemandsByProducts } from '../../domain/useCase/useDemandsByProducts';
import { Demand } from '../../domain/models/Demand';
import DemandsProductItem from './DemandsProductItem';

interface DemandsProductViewProps {
  demands: Demand[]; // Assuming Demand is the type of the demands collection
}

export const DemandsProductView: React.FC<DemandsProductViewProps> = ({
  demands, 
}) => {
  const {
    loading,
    error,
    data: productsSummary,
  } = useDemandsByProducts(demands);

  if (loading) return <p>Loading demands by product...</p>;
  if (error) return <p>Error loading demands: {error.message}</p>;

  return (
    <div className="demands-product-view">
      {productsSummary.map((product) => (
        <DemandsProductItem key={product.productId} product={product} />
      ))}
    </div>
  );
};
