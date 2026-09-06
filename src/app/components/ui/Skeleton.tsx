import { HTMLAttributes } from 'react';
import styles from './Skeleton.module.css';

interface Props extends HTMLAttributes<HTMLDivElement>{
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius,
  className,
}: Props) {
  return (
    <div
      className={`${styles.skeleton} ${className ?? ''}`}
      style={{ width, height, borderRadius }}
    />
  );
}