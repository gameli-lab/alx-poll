export default async function LookbookPage() {
  const entries = [
    { slug: "resort", title: "Resort Capsule" },
    { slug: "editorial", title: "Editorial" }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Lookbook</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((e) => (
          <li key={e.slug} className="border rounded-md p-4">{e.title}</li>
        ))}
      </ul>
    </div>
  );
}


