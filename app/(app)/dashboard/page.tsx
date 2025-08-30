"use client";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import StatsCards from "@/components/StatsCards";
import { monthRangeDateOnly } from "@/lib/date";  // ✅ FIXED
import { getExpensesInRange, Expense } from "@/lib/queries";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/client";
import CategoryDonut from "@/components/charts/CategoryDonut";

export default function DashboardPage() {
  const [items, setItems] = useState<Expense[]>([]);

  async function refresh() {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const { from, to } = monthRangeDateOnly(); // ✅ FIXED
    const data = await getExpensesInRange(uid, from, to);
    setItems(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  const total = items.reduce((s, i) => s + i.amount, 0);
  const days = new Date().getDate();
  const byCategory = items.reduce<Record<string, number>>(
    (acc, i) => ((acc[i.category] = (acc[i.category] || 0) + i.amount), acc),
    {}
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <ExpenseForm onAdded={refresh} />
      <StatsCards total={total} avgPerDay={total / Math.max(1, days)} count={items.length} />
      <CategoryDonut byCategory={byCategory} />
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Recent expenses</h2>
        <ExpenseList items={items} refresh={refresh} />
      </div>
    </div>
  );
}
