import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de gestión · Boda Vale & Edu",
  robots: "noindex,nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, background: "#FBF5EF", fontFamily: "Georgia, serif" }}>
        {children}
      </body>
    </html>
  );
}
