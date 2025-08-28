export default async function OrdersPage() {
  const orders = [
    { id: "1001", status: "paid", total: 320 },
    { id: "1002", status: "pending", total: 220 }
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Orders</h1>
      <ul className="space-y-2">
        {orders.map((o) => (
          <li key={o.id} className="border rounded-md p-4 flex justify-between">
            <span>Order #{o.id}</span>
            <span className="text-muted-foreground">{o.status} • GHS {o.total}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


