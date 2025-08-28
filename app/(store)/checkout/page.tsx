"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      // Placeholder: call server to create order + paystack init
      window.location.href = "/checkout/success?reference=demo";
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheckout} className="space-y-4">
            <Input placeholder="Full name" required />
            <Input placeholder="Email" type="email" required />
            <Input placeholder="Phone" required />
            <Input placeholder="Address" required />
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Processing..." : "Pay with Paystack"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


