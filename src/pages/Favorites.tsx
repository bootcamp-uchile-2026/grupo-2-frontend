import { EmptyState } from '../components/EmptyState';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import { useFavorites } from '../store/favorites';

export function Favorites() {

  const names = useFavorites((state) => state.names);
  const saved = products.filter(({ name }) => names.includes(name));

  if (!saved.length)
    return (
      <EmptyState
        title="Aún no tienes favoritos"
        description="Guarda tus productos favoritos para encontrarlos fácilmente."
        to="/productos"
        action="Ver productos"
      />
    );

  return (
    <main className="section">
      <h1 className="section-title">Mis favoritos</h1>
      <div className="home-product-grid">
        {saved.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </main>
  );
}
