import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";

export const revalidate = 120;

export default async function ProductsPage() {
  const products = [
    { id: "1", name: "Kente Dress", price: 320, image: "/vercel.svg" },
    { id: "2", name: "Ankara Shirt", price: 220, image: "/next.svg" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Products</h1>
        <Link className="underline" href="/collections">Browse collections</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}


