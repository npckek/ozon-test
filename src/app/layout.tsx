import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Ozon Frontend Test",
  description: "Created by Arseniy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="flex min-h-screen flex-col items-center justify-between p-24"
      >
        {children}
      </body>
    </html>
  );
}
