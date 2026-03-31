'use client';

import { useI18n } from '@/i18n';
import { Flame, Target, BookOpen } from 'lucide-react';

interface ProgressDashboardProps {
  streak: number;
  completedToday: number;
  totalPracticed: number;
  daysMap: Record<string, number>;
}

export default function ProgressDashboard({
  streak,
  completedToday,
  totalPracticed,
  daysMap,
}: ProgressDashboardProps) {
  const { t } = useI18n();

  // Generate last 12 weeks of calendar data
  const weeks: { date: string; count: number }[][] = [];
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Start from 12 weeks ago, aligned to Sunday
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - dayOfWeek - 7 * 11);

  for (let w = 0; w < 12; w++) {
    const week: { date: string; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + w * 7 + d);
      const dateStr = date.toISOString().slice(0, 10);
      const isFuture = date > today;
      week.push({
        date: dateStr,
        count: isFuture ? -1 : (daysMap[dateStr] || 0),
      });
    }
    weeks.push(week);
  }

  function getCellColor(count: number): string {
    if (count < 0) return 'transparent';
    if (count === 0) return 'var(--bg-control)';
    if (count <= 2) return 'var(--accent-dim)';
    if (count <= 5) return 'var(--accent-secondary)';
    return 'var(--accent-primary)';
  }

  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Stats row */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Flame size={16} style={{ color: streak > 0 ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
          <div>
            <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display), sans-serif' }}>
              {streak}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono), monospace' }}>
              {t.practice.streakDays}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Target size={16} style={{ color: completedToday > 0 ? 'var(--success)' : 'var(--text-muted)' }} />
          <div>
            <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display), sans-serif' }}>
              {completedToday}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono), monospace' }}>
              {t.practice.todayDone}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen size={16} style={{ color: totalPracticed > 0 ? 'var(--accent-secondary)' : 'var(--text-muted)' }} />
          <div>
            <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display), sans-serif' }}>
              {totalPracticed}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono), monospace' }}>
              {t.practice.totalExercises}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar heatmap */}
      <div className="overflow-x-auto">
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  className="rounded-sm"
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: getCellColor(day.count),
                    border: day.date === today.toISOString().slice(0, 10) ? '1px solid var(--accent-primary)' : 'none',
                  }}
                  title={`${day.date}: ${day.count >= 0 ? day.count : 0} ${t.practice.exercises}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
