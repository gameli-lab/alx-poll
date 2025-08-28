import Link from "next/link";

export default async function CollectionsPage() {
  const collections = [
    { slug: "ss25", name: "Spring/Summer '25" },
    { slug: "aw24", name: "Autumn/Winter '24" }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Collections</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((c) => (
          <li key={c.slug} className="border rounded-md p-4 hover:bg-muted/40 transition">
            <Link className="font-medium" href={`/collections/${c.slug}`}>{c.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


