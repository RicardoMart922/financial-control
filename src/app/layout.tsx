import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Application financial control",
  description: "Application for personal financial control",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="bg-[#252140] antialiased"
      >
        {children}
      </body>
    </html>
  );
}
