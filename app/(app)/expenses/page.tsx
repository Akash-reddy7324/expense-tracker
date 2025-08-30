"use client";
import { useEffect, useState } from "react";
import { getExpensesInRange, Expense } from "@/lib/queries";
import { auth } from "@/firebase/client";

export default function ExpensesPage(){
  const [from, setFrom] = useState<string>(new Date(new Date().setMonth(new Date().getMonth()-1)).toISOString().slice(0,10));
  const [to, setTo] = useState<string>(new Date().toISOString().slice(0,10));
  const [items, setItems] = useState<Expense[]>([]);
  async function refresh(){
    const uid = auth.currentUser?.uid;
    if(!uid) return;
    const data = await getExpensesInRange(uid, new Date(from+"T00:00:00").toISOString(), new Date(to+"T23:59:59").toISOString());
    setItems(data);
  }
  useEffect(()=>{ refresh(); }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Expenses</h1>
      <div className="flex gap-2 items-end">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">From</label>
          <input type="date" className="border p-2 rounded" value={from} onChange={e=>setFrom(e.target.value)}/>
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">To</label>
          <input type="date" className="border p-2 rounded" value={to} onChange={e=>setTo(e.target.value)}/>
        </div>
        <button onClick={refresh} className="px-4 py-2 rounded bg-blue-600 text-white">Apply</button>
      </div>
      <ul className="divide-y border rounded-lg">
        {items.map(e=>(
          <li key={e.id} className="p-3 flex justify-between">
            <div>₹{e.amount.toFixed(2)} · {e.category}</div>
            <div className="text-gray-600 text-sm">{new Date(e.date).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
