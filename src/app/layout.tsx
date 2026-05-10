import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'LuminaFit - Plataforma de Entrenamiento',
  description: 'Sistema profesional de gestión de entrenamiento personal en Argentina',
  keywords: ['entrenamiento', 'fitness', 'alumnos', 'rutinas', 'personal trainer', 'LuminaFit'],
  authors: [{ name: 'LuminaFit Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: 'LuminaFit',
    description: 'Plataforma profesional de entrenamiento personal',
    type: 'website',
    locale: 'es_ES',
    url: baseUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuminaFit',
    description: 'Plataforma profesional de entrenamiento personal',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={inter.className}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
