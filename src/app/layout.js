import {Geist, Geist_Mono, Ubuntu} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CCP Student Management System",
  description: "A student management system for Central Calcutta Polytechnic",
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body className={`${ubuntu.variable}  `}>{children}</body>
    </html>
  );
}
