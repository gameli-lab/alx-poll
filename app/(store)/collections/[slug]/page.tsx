import ProductCard from "@/components/product/ProductCard";

type Props = { params: { slug: string } };

export default async function CollectionDetailPage({ params }: Props) {
  const products = [
    { id: "1", name: `${params.slug} Piece 1`, price: 300, image: "/vercel.svg" },
    { id: "2", name: `${params.slug} Piece 2`, price: 260, image: "/next.svg" }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold capitalize">Collection: {params.slug.replace(/-/g, " ")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}


