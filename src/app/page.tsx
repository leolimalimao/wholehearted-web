import { Metadata } from 'next';
import { Dashboard } from './Dashboard';

export const metadata: Metadata = {
  title: 'wholehearted.stats',
  description: 'Suas estatísticas de escuta do Spotify.',
};

export default function Home() {
  return <Dashboard />;
}