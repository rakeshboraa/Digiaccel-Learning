import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: " To Do Digiaccel Learning",
  description: "A simple to-do app",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="flex h-full items-center justify-center bg-black  text-ink">
        <div className="relative flex h-full max-h-210 w-full max-w-97.5 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
