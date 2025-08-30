import "./globals.css";
import type { Metadata } from "next";
import AuthGate from "@/components/AuthGate";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track expenses with insights (Firebase + Next.js)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-gray-100">
        <AuthGate>
          <div className="max-w-3xl mx-auto p-6 space-y-6">
            {children}
          </div>
        </AuthGate>
      </body>
    </html>
  );
}
