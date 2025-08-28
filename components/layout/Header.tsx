"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="container mx-auto px-4 py-4 flex items-center gap-4">
      <Link href="/" className="font-bold text-xl">Designer</Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link className={pathname?.startsWith("/products") ? "font-semibold" : ""} href="/products">Products</Link>
        <Link className={pathname?.startsWith("/collections") ? "font-semibold" : ""} href="/collections">Collections</Link>
        <Link className={pathname?.startsWith("/lookbook") ? "font-semibold" : ""} href="/lookbook">Lookbook</Link>
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <Input placeholder="Search" className="w-40 md:w-64" />
        <Button asChild variant="outline"><Link href="/account">Account</Link></Button>
        <Button asChild><Link href="/cart">Cart</Link></Button>
      </div>
    </header>
  );
}


