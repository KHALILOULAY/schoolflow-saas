import "./globals.css";

export const metadata = {
  title: "SchoolFlow SaaS",
  description: "Dashboard de gestion d'établissement scolaire",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
