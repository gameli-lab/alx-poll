import type { ReactNode } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Separator />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <Separator />
      <Footer />
      <div className="fixed bottom-4 right-4">
        <Button asChild>
          <Link href="/cart">View Cart</Link>
        </Button>
      </div>
    </div>
  );
}


