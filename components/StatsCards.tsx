export default function StatsCards({ total, avgPerDay, count }: { total: number; avgPerDay: number; count: number }) {
  const items = [
    { label: "This Month", value: `₹${total.toFixed(2)}` },
    { label: "Avg / Day", value: `₹${avgPerDay.toFixed(2)}` },
    { label: "Entries", value: `${count}` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((x) => (
        <div key={x.label} className="card text-center">
          <div className="text-sm text-gray-400">{x.label}</div>
          <div className="text-2xl font-bold text-white mt-1">{x.value}</div>
        </div>
      ))}
    </div>
  );
}
