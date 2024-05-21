import AuthProvider from "./(components)/AuthProvider";
import Nav from "./(components)/Nav";
import "./globals.css";

export const metadata = {
  title: "ESNsync - Next",
  description: "Internal Managment System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          <Nav />
          <div>{children}</div>
        </body>
      </AuthProvider>
    </html>
  );
}
