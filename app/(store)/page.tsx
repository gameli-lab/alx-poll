import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCard from "@/components/product/ProductCard";

export const revalidate = 60;

export default async function StoreHomePage() {
  // Placeholder featured items
  const featured = [
    { id: "1", name: "Kente Dress", price: 320, image: "/vercel.svg" },
    { id: "2", name: "Ankara Shirt", price: 220, image: "/next.svg" },
    { id: "3", name: "African Print Skirt", price: 180, image: "/globe.svg" }
  ];

  return (
    <div className="space-y-10">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Designer's Store</CardTitle>
        </CardHeader>
        <CardContent>
          Explore curated fashion with a Ghanaian identity. Collections, lookbooks, and more coming soon.
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </section>
    </div>
  );
}


