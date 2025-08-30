import { db } from "@/firebase/client";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

export type PaymentMethod = "cash" | "upi" | "card" | "bank" | "other";

export type Expense = {
  id?: string;
  userId: string;
  date: string; // now stored as "YYYY-MM-DD"
  amount: number;
  category: string;
  note?: string;
  paymentMethod?: PaymentMethod;
  createdAt?: any;
  updatedAt?: any;
};

/**
 * Add a new expense
 * - Stores date as "YYYY-MM-DD" (no UTC conversion issues)
 * - Adds createdAt/updatedAt timestamps
 */
export async function addExpense(
  uid: string,
  data: Omit<Expense, "userId" | "createdAt" | "updatedAt" | "id">
) {
  const ref = await addDoc(collection(db, "expenses", uid, "items"), {
    userId: uid,
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Get expenses in a given date range
 * - fromDate and toDate should be "YYYY-MM-DD"
 */
export async function getExpensesInRange(
  uid: string,
  fromDate: string,
  toDate: string
) {
  const q = query(
    collection(db, "expenses", uid, "items"),
    where("date", ">=", fromDate),
    where("date", "<=", toDate),
    orderBy("date", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Expense) }));
}

/**
 * Delete expense by id
 */
export async function deleteExpense(uid: string, id: string) {
  await deleteDoc(doc(db, "expenses", uid, "items", id));
}

/**
 * Update expense (partial update)
 */
export async function updateExpense(
  uid: string,
  id: string,
  patch: Partial<Expense>
) {
  await updateDoc(doc(db, "expenses", uid, "items", id), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}
