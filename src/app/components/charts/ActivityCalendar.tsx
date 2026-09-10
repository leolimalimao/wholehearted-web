'use client';

import React, { useState, useMemo } from 'react';
import { DayActivity } from '../../lib/types';
import { Skeleton } from '../ui/Skeleton';
import styles from './ActivityCalendar.module.css';

export function ActivityCalendarSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Skeleton height="0.7rem" width="160px" />
        <Skeleton height="0.75rem" width="140px" />
      </div>

      <div className={styles.calendarContainer}>
        <div className={`${styles.calendarGrid} ${styles.calendarGridSkeleton}`}>
          {/* Labels dos dias da semana */}
          <div className={styles.dayLabels}>
            <span className={styles.dayLabel}></span>
            <span className={styles.dayLabel}>seg</span>
            <span className={styles.dayLabel}></span>
            <span className={styles.dayLabel}>qua</span>
            <span className={styles.dayLabel}></span>
            <span className={styles.dayLabel}>sex</span>
            <span className={styles.dayLabel}></span>
          </div>

          {/* Colunas das semanas (skeleton) */}
          <div className={styles.weeksWrapper}>
            {Array.from({ length: 53 }).map((_, wIdx) => (
              <div key={wIdx} className={styles.weekColumn}>
                <div className={styles.monthLabel} />
                {Array.from({ length: 7 }).map((_, dIdx) => (
                  <div key={dIdx} className={styles.cellSkeleton} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legenda de intensidades skeleton */}
      <div className={styles.footer}>
        <Skeleton height="0.65rem" width="110px" />
      </div>
    </div>
  );
}

interface Props {
  data?: DayActivity[];
  isLoading?: boolean;
}

interface DayCell {
  date: Date;
  dateKey: string;
  plays: number;
  level: number;
  isWithinWindow: boolean;
}

export function ActivityCalendar({ data, isLoading }: Props) {
  if (isLoading || !data) {
    return <ActivityCalendarSkeleton />;
  }
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    plays: number;
    formattedDate: string;
  } | null>(null);

  // Mapeia os plays por dia no formato YYYY-MM-DD
  const playsMap = useMemo(() => {
    const map = new Map<string, number>();
    if (!data) return map;

    for (const d of data) {
      if (!d?.date) continue;
      // Trata strings ISO ou YYYY-MM-DD
      const key = d.date.slice(0, 10);
      const count = parseInt(d.plays, 10) || 0;
      map.set(key, (map.get(key) ?? 0) + count);
    }
    return map;
  }, [data]);

  // Monta a grade de 52 semanas completas (~1 ano até hoje, estilo GitHub)
  const { weeks, monthLabels, totalWindowPlays } = useMemo(() => {
    const now = new Date();
    // Normaliza hoje à meia-noite local
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 52 semanas completas (364 dias)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 52 * 7);
    // Alinha para o domingo anterior ou mesmo dia
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Encontra o maior número de plays para calcular a escala de cores
    let max = 0;
    let windowSum = 0;

    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      const p = playsMap.get(key) ?? 0;
      windowSum += p;
      if (p > max) max = p;
    }

    const cols: DayCell[][] = [];
    const months: { label: string; colIndex: number }[] = [];
    let currentWeek: DayCell[] = [];
    let lastMonth = -1;
    let lastMonthCol = -4;

    // Itera dia a dia a partir de startDate até o final da semana do today (Sábado)
    const endCalendar = new Date(today);
    endCalendar.setDate(endCalendar.getDate() + (6 - endCalendar.getDay()));

    let colIdx = 0;
    for (let cur = new Date(startDate); cur <= endCalendar; cur.setDate(cur.getDate() + 1)) {
      const dayOfWeek = cur.getDay();
      const curDate = new Date(cur);
      const dateKey = curDate.toISOString().slice(0, 10);
      const isWithinWindow = curDate >= startDate && curDate <= today;
      const plays = isWithinWindow ? (playsMap.get(dateKey) ?? 0) : 0;

      let level = 0;
      if (isWithinWindow && plays > 0) {
        if (max <= 4) {
          level = Math.min(plays, 4);
        } else {
          const ratio = plays / max;
          if (ratio <= 0.25) level = 1;
          else if (ratio <= 0.5) level = 2;
          else if (ratio <= 0.75) level = 3;
          else level = 4;
        }
      }

      currentWeek.push({
        date: curDate,
        dateKey,
        plays,
        level,
        isWithinWindow,
      });

      // Se é domingo e mudou de mês, anota para o label
      if (dayOfWeek === 0 && curDate.getMonth() !== lastMonth) {
        lastMonth = curDate.getMonth();
        // Evita rótulos colados demais se a virada do mês ocorreu muito próxima
        if (colIdx - lastMonthCol >= 3) {
          const monthName = curDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
          months.push({ label: monthName, colIndex: colIdx });
          lastMonthCol = colIdx;
        }
      }

      if (dayOfWeek === 6) {
        cols.push(currentWeek);
        currentWeek = [];
        colIdx++;
      }
    }

    if (currentWeek.length > 0) {
      cols.push(currentWeek);
    }

    return {
      weeks: cols,
      monthLabels: months,
      totalWindowPlays: windowSum,
    };
  }, [playsMap]);

  const handleMouseEnter = (cell: DayCell, e: React.MouseEvent<HTMLDivElement>) => {
    if (!cell.isWithinWindow) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const formattedDate = cell.date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top,
      plays: cell.plays,
      formattedDate,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={styles.title}>calendário de atividade</p>
        <span className={styles.summary}>
          {totalWindowPlays.toLocaleString('pt-BR')} scrobbles no último ano
        </span>
      </div>

      <div className={styles.calendarContainer}>
        <div className={styles.calendarGrid}>
          {/* Labels dos dias da semana (GitHub exibe Seg, Qua, Sex) */}
          <div className={styles.dayLabels}>
            <span className={styles.dayLabel}></span>
            <span className={styles.dayLabel}>seg</span>
            <span className={styles.dayLabel}></span>
            <span className={styles.dayLabel}>qua</span>
            <span className={styles.dayLabel}></span>
            <span className={styles.dayLabel}>sex</span>
            <span className={styles.dayLabel}></span>
          </div>

          {/* Colunas das semanas */}
          <div className={styles.weeksWrapper}>
            {weeks.map((week, wIdx) => {
              // Verifica se tem rótulo de mês nessa coluna
              const month = monthLabels.find((m) => m.colIndex === wIdx);

              return (
                <div key={wIdx} className={styles.weekColumn}>
                  <div className={styles.monthLabel}>
                    {month ? month.label : ''}
                  </div>
                  {week.map((cell) => {
                    if (!cell.isWithinWindow) {
                      return <div key={cell.dateKey} className={styles.cellEmpty} />;
                    }

                    const levelClass =
                      cell.level === 1
                        ? styles.level1
                        : cell.level === 2
                        ? styles.level2
                        : cell.level === 3
                        ? styles.level3
                        : cell.level === 4
                        ? styles.level4
                        : styles.level0;

                    return (
                      <div
                        key={cell.dateKey}
                        className={`${styles.cell} ${levelClass}`}
                        onMouseEnter={(e) => handleMouseEnter(cell, e)}
                        onMouseLeave={handleMouseLeave}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legenda de intensidades */}
      <div className={styles.footer}>
        <span className={styles.legendText}>menos</span>
        <div className={styles.legendScale}>
          <div className={`${styles.legendCell} ${styles.level0}`} />
          <div className={`${styles.legendCell} ${styles.level1}`} />
          <div className={`${styles.legendCell} ${styles.level2}`} />
          <div className={`${styles.legendCell} ${styles.level3}`} />
          <div className={`${styles.legendCell} ${styles.level4}`} />
        </div>
        <span className={styles.legendText}>mais</span>
      </div>

      {/* Tooltip flutuante */}
      {tooltip && (
        <div
          className={styles.tooltip}
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          <span className={styles.tooltipCount}>
            {tooltip.plays === 0
              ? 'nenhum scrobble'
              : `${tooltip.plays.toLocaleString('pt-BR')} ${
                  tooltip.plays === 1 ? 'scrobble' : 'scrobbles'
                }`}
          </span>
          <span className={styles.tooltipDate}>{tooltip.formattedDate}</span>
        </div>
      )}
    </div>
  );
}
