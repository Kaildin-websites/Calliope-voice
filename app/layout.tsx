import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Calliope Voice · L’assistente vocale per chi vende impianti",
  description: "Calliope risponde alle chiamate, richiama i tuoi contatti e fissa i sopralluoghi. Provala su cinque chiamate vere.",
  icons: { icon: "/assets/calliope-muse.webp" },
  robots: { index: false, follow: false },
};
export default function Layout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="it"><body>{children}</body></html>;
}
