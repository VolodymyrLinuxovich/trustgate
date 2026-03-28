import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TrustGate",
  description: "Trust Layer and Evaluation Harness for AI Agents"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
