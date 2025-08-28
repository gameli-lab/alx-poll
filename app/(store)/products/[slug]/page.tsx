import Image from "next/image";
import { Button } from "@/components/ui/button";

type Props = { params: { slug: string } };

export default async function ProductDetailPage({ params }: Props) {
  const product = {
    name: params.slug.replace(/-/g, " "),
    price: 250,
    image: "/window.svg"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="aspect-square relative bg-muted/20">
        <Image src={product.image} alt={product.name} fill className="object-contain" />
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold capitalize">{product.name}</h1>
        <p className="text-xl">GHS {product.price}</p>
        <Button size="lg">Add to cart</Button>
      </div>
    </div>
  );
}


