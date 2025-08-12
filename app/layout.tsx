import "../styles/globals.css";
import ClientLayout from "../components/ClientLayout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary min-h-screen font-sans" style={{ fontFamily: 'Inter, Segoe UI, Helvetica Neue, Arial, Liberation Sans, sans-serif' }}>
        <ClientLayout>
          {children}  
        </ClientLayout>
      </body>
    </html>
  );
}



