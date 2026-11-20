import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VayuSaathi (वायुसाथी) — Family & Community Winter Smog Co-Pilot',
  description: 'Grounded atmospheric civic co-pilot for urban families navigating severe winter temperature inversions, toxic AQI peaks, and low-emission routines.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-100 text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
