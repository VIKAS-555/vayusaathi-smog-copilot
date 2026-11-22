import type { Metadata } from 'next';
import './globals.css';
import { BreathLineProvider } from '@/context/BreathLineContext';
import { MathEngineDrawer } from '@/components/MathEngineDrawer';
import { StationOverridesDrawer } from '@/components/StationOverridesDrawer';

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
      <body className="min-h-screen bg-stone-100 dark:bg-[#121615] text-ink dark:text-stone-100 antialiased overflow-x-hidden">
        <BreathLineProvider>
          {children}
          <MathEngineDrawer />
          <StationOverridesDrawer />
        </BreathLineProvider>
      </body>
    </html>
  );
}
