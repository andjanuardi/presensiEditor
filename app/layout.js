import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "PRESENSI EDITOR",
  description: "PRESENSI EDITOR",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="main p-2 flex flex-col gap-2 h-dvh bg-base-300 ">
          <Navbar />
          <div className="border-base-300 bg-white shadow-inner  border flex-1 p-3 rounded-lg">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
