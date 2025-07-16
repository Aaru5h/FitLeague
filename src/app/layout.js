import Navbar from '@/components/Navbar';
import {AuthProvider} from '@/context/AuthContext';
import './globals.css'; // global styles or other imports if any

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <AuthProvider>
          <Navbar />
          {/* Wrap the children (the content of the page) */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}