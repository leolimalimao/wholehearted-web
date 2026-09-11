import type { Metadata } from 'next';
import { QueryProvider } from './components/layout/QueryProvider';
import { AuroraBackground } from './components/layout/AuroraBackground';
import { Footer } from './components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'wholehearted.stats',
  description: 'Suas estatísticas de escuta do Spotify.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuroraBackground />
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <QueryProvider>
            <main style={{ flex: '1 0 auto' }}>
              {children}
            </main>
            <Footer />
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}