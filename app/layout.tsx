import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stock Index Visualizer",
  description: "A tool to visualize stock index data ,and trends",
  authors: [{ name: "ABHAY" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@1,2&display=swap" rel="stylesheet" /> 
      </head>
      <body>{children}</body>
    </html>
  );
}
