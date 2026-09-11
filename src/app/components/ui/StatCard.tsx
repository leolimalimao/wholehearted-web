'use client';

import React, { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { Skeleton } from './Skeleton';
import styles from './StatCard.module.css';

interface Props {
  label: string;
  value?: string | number;
  sub?: string;
  isLoading?: boolean;
}

const SPRING_CONFIG = { stiffness: 260, damping: 20 };

export function StatCard({ label, value, sub, isLoading = false }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Coordenadas normalizadas do mouse em relação ao centro (-0.5 a 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Posição em porcentagem para o reflexo luminoso (glare)
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  // Física de mola orgânica para amortecer o movimento e repousar suavemente
  const springX = useSpring(mouseX, SPRING_CONFIG);
  const springY = useSpring(mouseY, SPRING_CONFIG);

  // Rotações 3D: inclinação Y reage ao mouse vertical; rotação X reage ao mouse horizontal
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  // Gradiente radial reativo à posição do cursor
  const glareBackground = useMotionTemplate`radial-gradient(280px circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.08), transparent 80%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x / rect.width - 0.5);
    mouseY.set(y / rect.height - 0.5);

    glareX.set((x / rect.width) * 100);
    glareY.set((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (isLoading) {
    return (
      <div className={styles.perspectiveContainer}>
        <div className={styles.card}>
          <Skeleton height="0.7rem" width="60%" />
          <Skeleton height="2.5rem" width="80%" style={{ marginTop: '0.5rem' }} />
          <Skeleton height="0.75rem" width="40%" style={{ marginTop: '0.5rem' }} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.perspectiveContainer}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <motion.div
        ref={cardRef}
        className={styles.card}
        style={
          shouldReduceMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
        }
        whileHover={
          shouldReduceMotion
            ? { y: -4 }
            : {
                scale: 1.025,
                transition: { duration: 0.2 },
              }
        }
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleMouseLeave}
      >
        {/* Camada de reflexo de luz dinâmico */}
        <motion.div
          className={styles.glare}
          style={{ background: glareBackground }}
          aria-hidden="true"
        />

        {/* Elementos internos com profundidade Z para parallax 3D */}
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
        {sub && <p className={styles.sub}>{sub}</p>}
      </motion.div>
    </motion.div>
  );
}