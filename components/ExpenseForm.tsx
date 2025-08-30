"use client";
import { useState } from "react";
import { z } from "zod";
import { addExpense, PaymentMethod } from "@/lib/queries";
import { auth } from "@/firebase/client";

// Schema expects date-only string
const schema = z.object({
  date: z.string().min(1), // "YYYY-MM-DD"
  amount: z.coerce.number().positive(),
  category: z.string().min(1),
  note: z.string().optional(),
  paymentMethod: z.enum(["cash", "upi", "card", "bank", "other"]).optional(),
});

export default function ExpenseForm({ onAdded }: { onAdded?: () => void }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10), // default today
    amount: "",
    category: "Food",
    note: "",
    paymentMethod: "upi" as PaymentMethod,
  });
  const [busy, setBusy] = useState(false);
  const uid = auth.currentUser?.uid;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ ...form, amount: Number(form.amount) });
    if (!parsed.success || !uid) {
      return alert("Check inputs or login again.");
    }
    setBusy(true);
    try {
      await addExpense(uid, parsed.data);
      setForm({ ...form, amount: "", note: "" }); // reset inputs
      onAdded?.(); // refresh list
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 md:grid-cols-5">
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
      />
      <input
        inputMode="decimal"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))}
      />
      <select
        value={form.category}
        onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
      >
        {["Food", "Travel", "Shopping", "Bills", "Health", "Entertainment", "Education", "Other"].map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <input
        placeholder="Note"
        value={form.note}
        onChange={(e) => setForm((s) => ({ ...s, note: e.target.value }))}
      />
      <select
        value={form.paymentMethod}
        onChange={(e) => setForm((s) => ({ ...s, paymentMethod: e.target.value as PaymentMethod }))}
      >
        {["cash", "upi", "card", "bank", "other"].map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <button disabled={busy} className="btn-primary md:col-span-5">
        {busy ? "Saving…" : "Add Expense"}
      </button>
    </form>
  );
}
