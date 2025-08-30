import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Each row = [date, amount, category, note, paymentMethod]
  const rows: (string | number | null | undefined)[][] = await req.json();

  const header = ["Date", "Amount", "Category", "Note", "Payment Method"];

  const csv = [header, ...rows]
    .map((r: (string | number | null | undefined)[]) =>
      r
        .map((v: string | number | null | undefined) =>
          `"${String(v ?? "").replace(/"/g, '""')}"`
        )
        .join(",")
    )
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv;charset=utf-8",
      "Content-Disposition": `attachment; filename="expenses-${Date.now()}.csv"`,
    },
  });
}

