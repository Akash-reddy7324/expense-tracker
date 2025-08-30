"use client";
import { useState } from "react";
import { deleteExpense, updateExpense, Expense, PaymentMethod } from "@/lib/queries";
import { auth } from "@/firebase/client";
import { parseISO, format } from "date-fns";

export default function ExpenseList({ items, refresh }: { items: Expense[]; refresh: () => void }) {
  const uid = auth.currentUser?.uid;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Expense>>({});

  if (!uid) {
    return <p className="p-3 text-red-400">Please login to see expenses.</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((e) => {
        const isEditing = editingId === e.id;

        return (
          <li key={e.id} className="card">
            {isEditing ? (
              // --- EDIT FORM ---
              <form
                onSubmit={async (ev) => {
                  ev.preventDefault();
                  try {
                    await updateExpense(uid, e.id!, editForm);
                    setEditingId(null);
                    setEditForm({});
                    refresh();
                  } catch (err) {
                    alert("Failed to update expense: " + (err as Error).message);
                  }
                }}
                className="flex flex-col md:flex-row gap-2 w-full"
              >
                <input
                  type="date"
                  value={editForm.date ?? e.date}
                  onChange={(ev) => setEditForm((f) => ({ ...f, date: ev.target.value }))}
                />
                <input
                  type="number"
                  value={editForm.amount ?? e.amount}
                  onChange={(ev) => setEditForm((f) => ({ ...f, amount: Number(ev.target.value) }))}
                />
                <select
                  value={editForm.category ?? e.category}
                  onChange={(ev) => setEditForm((f) => ({ ...f, category: ev.target.value }))}
                >
                  {["Food","Travel","Shopping","Bills","Health","Entertainment","Education","Other"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Note"
                  value={editForm.note ?? e.note ?? ""}
                  onChange={(ev) => setEditForm((f) => ({ ...f, note: ev.target.value }))}
                />
                <select
                  value={editForm.paymentMethod ?? e.paymentMethod ?? "cash"}
                  onChange={(ev) => setEditForm((f) => ({ ...f, paymentMethod: ev.target.value as PaymentMethod }))}
                >
                  {["cash","upi","card","bank","other"].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <button type="submit" className="btn-primary px-3 py-1">Save</button>
                  <button type="button" onClick={() => setEditingId(null)} className="btn-secondary px-3 py-1">Cancel</button>
                </div>
              </form>
            ) : (
              // --- READ MODE ---
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="font-medium text-white">₹{e.amount.toFixed(2)} — {e.category}</div>
                  <div className="text-gray-400 text-xs">
                    {format(parseISO(e.date), "dd MMM yyyy")} · {e.note || "—"} · {e.paymentMethod || "—"}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingId(e.id!);
                      setEditForm(e); // preload form with existing values
                    }}
                    className="text-blue-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await deleteExpense(uid, e.id!);
                        refresh();
                      } catch (err) {
                        alert("Failed to delete expense: " + (err as Error).message);
                      }
                    }}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        );
      })}
      {items.length === 0 && <li className="text-gray-500">No expenses yet.</li>}
    </ul>
  );
}
