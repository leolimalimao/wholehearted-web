import type { Metadata } from 'next';
import { QueryProvider } from './components/layout/QueryProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Leo Stats',
  description: 'Estatísticas de escuta do Spotify',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}