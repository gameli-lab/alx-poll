"use client";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Product = { id: string; name: string; price: number; image: string; slug?: string };

export default function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.slug ?? product.name.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <Card className="overflow-hidden">
      <Link href={href} className="block aspect-square relative bg-muted/20">
        <Image src={product.image} alt={product.name} fill className="object-contain" />
      </Link>
      <CardHeader>
        <CardTitle className="text-base line-clamp-1">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="font-medium">GHS {product.price}</div>
        <Button asChild size="sm"><Link href={href}>View</Link></Button>
      </CardContent>
    </Card>
  );
}


