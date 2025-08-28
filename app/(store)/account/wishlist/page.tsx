import ProductCard from "@/components/product/ProductCard";

export default async function WishlistPage() {
  const items = [
    { id: "w1", name: "Ankara Shirt", price: 220, image: "/next.svg" }
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}


