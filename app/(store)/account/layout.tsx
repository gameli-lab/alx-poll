import type { ReactNode } from "react";
import Link from "next/link";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <aside className="md:col-span-1 space-y-2">
        <div className="font-semibold">Account</div>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/account">Overview</Link>
          <Link href="/account/orders">Orders</Link>
          <Link href="/account/wishlist">Wishlist</Link>
          <Link href="/account/addresses">Addresses</Link>
        </nav>
      </aside>
      <section className="md:col-span-3">
        {children}
      </section>
    </div>
  );
}


