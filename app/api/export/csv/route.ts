import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const rows: any[] = await req.json(); // expects [[date, amount, category, note, paymentMethod], ...]
  const header = ["Date","Amount","Category","Note","Payment Method"];
  const csv = [header, ...rows].map(r => r.map(v => `"${String(v ?? "").replace(/"/g,'""')}"`).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv;charset=utf-8",
      "Content-Disposition": `attachment; filename="expenses-${Date.now()}.csv"`
    }
  });
}
