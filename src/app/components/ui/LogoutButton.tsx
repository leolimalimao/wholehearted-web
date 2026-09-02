'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import styles from './LogoutButton.module.css';

export function LogoutButton() {
  const queryClient = useQueryClient();
  const router = useRouter();

  async function handleLogout() {
    const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');
    await fetch(`${base}/api/auth/logout`, {
      credentials: 'include',
    });

    // limpa o cache do React Query
    queryClient.clear();

    // redireciona pra raiz
    router.push('/');
  }

  return (
    <button className={styles.button} onClick={handleLogout}>
      sair
    </button>
  );
}