import Navbar from '@/components/Navbar';
import {AuthProvider} from '@/context/AuthContext';
import {StravaProvider} from '@/context/StravaContext';
import './globals.css'; // global styles or other imports if any

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <AuthProvider>
          <StravaProvider>
            <Navbar />
            {/* Wrap the children (the content of the page) */}
            {children}
          </StravaProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
