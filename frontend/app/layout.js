import './globals.css';

export const metadata = {
  title: 'FinanceFlow — Smart Financial Dashboard',
  description: 'Premium financial dashboard with real-time analytics, budget tracking, and transaction management.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-inter antialiased">
        {children}
      </body>
    </html>
  );
}
