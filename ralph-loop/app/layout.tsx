import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoteApp",
  description: "A note-taking app with rich text editing and public sharing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
