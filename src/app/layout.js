import Navbar from '@/components/Navbar';
import './globals.css'; // global styles or other imports if any

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Navbar />
        {/* Wrap the children (the content of the page) */}
        {children}
      </body>
    </html>
  );
}