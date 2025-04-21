import { AuthContextProvider } from "./_utils/authContext";
import "../app/globals.css"; // Assuming you are using inline Tailwind and a simple globals

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
