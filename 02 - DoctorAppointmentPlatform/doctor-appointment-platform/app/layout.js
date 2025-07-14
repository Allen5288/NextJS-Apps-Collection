import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MediCall - doctors appointment platform",
  description: "Connect with doctors and book appointments easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {/* header */}
        <main className="min-h-screen"> {children}</main>

        {/* footer */}
        <footer className="bg-muted/50 py-12">
          <div className="container mx-auto px-4 text-center text-grey-200">
            <p>Made with Allen</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
