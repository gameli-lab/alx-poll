import Link from "next/link";

export default function Footer() {
  return (
    <footer className="container mx-auto px-4 py-10 text-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
        <div>
          <div className="font-semibold">Designer</div>
          <p className="text-muted-foreground">Crafted fashion from Ghana.</p>
        </div>
        <nav className="flex gap-4">
          <Link href="/collections">Collections</Link>
          <Link href="/lookbook">Lookbook</Link>
          <Link href="/account">Account</Link>
        </nav>
      </div>
      <div className="mt-6 text-muted-foreground">© {new Date().getFullYear()} All rights reserved.</div>
    </footer>
  );
}


