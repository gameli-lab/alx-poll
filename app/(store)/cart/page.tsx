"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function CartPage() {
  const [items, setItems] = useState([
    { id: "1", name: "Kente Dress", price: 320, qty: 1, image: "/vercel.svg" }
  ]);
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((it) => (
            <Card key={it.id} className="overflow-hidden">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="relative h-16 w-16 bg-muted/20">
                  <Image src={it.image} alt={it.name} fill className="object-contain" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-muted-foreground">GHS {it.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setItems((s) => s.map(x => x.id === it.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}>-</Button>
                  <div>{it.qty}</div>
                  <Button variant="outline" size="sm" onClick={() => setItems((s) => s.map(x => x.id === it.id ? { ...x, qty: x.qty + 1 } : x))}>+</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between"><span>Subtotal</span><span>GHS {total}</span></div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <a href="/checkout">Proceed to Checkout</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}


