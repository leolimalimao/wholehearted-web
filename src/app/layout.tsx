import type { Metadata } from 'next';
import { QueryProvider } from './components/layout/QueryProvider';
import { AuroraBackground } from './components/layout/AuroraBackground';
import './globals.css';

export const metadata: Metadata = {
  title: 'Leo Stats',
  description: 'Estatísticas de escuta do Spotify',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuroraBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <QueryProvider>
            {children}
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}