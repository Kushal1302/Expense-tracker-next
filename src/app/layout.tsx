import type { Metadata } from "next";
import "./globals.css";
import NextAuthProvider from "@/NextAuthProvider";
import TrpcProvider from "@/components/TrpcProvider";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Now you can track your monthly expense",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TrpcProvider>
          <NextAuthProvider>{children}</NextAuthProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}
