import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BreathLine — Winter Air & Routine Guide',
  description: 'Household air quality co-pilot helping urban families navigate severe winter temperature inversions, toxic AQI peaks, and low-emission daily routines.',
  icons: {
    icon: '/breathline-mark.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-100 text-ink antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
