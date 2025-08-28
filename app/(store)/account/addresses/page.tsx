import { Card, CardContent } from "@/components/ui/card";

export default async function AddressesPage() {
  const addresses = [
    { id: "a1", label: "Home", street: "123 Independence Ave", city: "Accra" }
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Addresses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((a) => (
          <Card key={a.id}><CardContent className="p-4">
            <div className="font-medium">{a.label}</div>
            <div className="text-sm text-muted-foreground">{a.street}, {a.city}</div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}


