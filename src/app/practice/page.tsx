'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { I18nProvider, useI18n, Locale } from '@/i18n';
import { useSkin } from '@/hooks/useSkin';
import { usePracticeLog } from '@/hooks/usePracticeLog';
import { usePracticePlayer } from '@/hooks/usePracticePlayer';
import { useRecommendation } from '@/hooks/useRecommendation';
import { Exercise } from '@/lib/practice/types';
import TodayPlan from '@/components/practice/TodayPlan';
import ExerciseBrowser from '@/components/practice/ExerciseBrowser';
import ExerciseDetail from '@/components/practice/ExerciseDetail';
import ProgressDashboard from '@/components/practice/ProgressDashboard';
import MiniMetronome from '@/components/practice/MiniMetronome';
import {
  Sun,
  Moon,
  Palette,
  Languages,
  MoreHorizontal,
  Music,
  BookOpen,
  ChevronLeft,
} from 'lucide-react';
import SkinPicker from '@/components/metronome/SkinPicker';
import Link from 'next/link';

const LOCALE_CYCLE: Locale[] = ['zh', 'en', 'ja'];
const LOCALE_LABELS: Record<Locale, string> = { zh: '中', en: 'EN', ja: 'JA' };

type ViewTab = 'today' | 'library';

function PracticeContent() {
  const { locale, setLocale, t } = useI18n();
  const { skinId, mode, changeSkin, toggleMode } = useSkin();
  const practiceLog = usePracticeLog();
  const player = usePracticePlayer();
  const recommendation = useRecommendation(practiceLog.entries);

  const [activeTab, setActiveTab] = useState<ViewTab>('today');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showSkinPicker, setShowSkinPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [practiceStartTime, setPracticeStartTime] = useState<number | null>(null);

  const cycleLocale = () => {
    const idx = LOCALE_CYCLE.indexOf(locale);
    setLocale(LOCALE_CYCLE[(idx + 1) % LOCALE_CYCLE.length]);
  };

  // Close more menu on outside click
  useEffect(() => {
    if (!showMoreMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMoreMenu]);

  const handlePlayExercise = useCallback((exercise: Exercise) => {
    player.loadExercise(exercise);
    setSelectedExercise(exercise);
    setPracticeStartTime(Date.now());
    // Auto-play after a small delay to allow loadExercise to set up
    setTimeout(() => {
      player.play();
    }, 50);
  }, [player]);

  const handleStopExercise = useCallback(() => {
    player.stop();
  }, [player]);

  const handleSelectExercise = useCallback((exercise: Exercise) => {
    setSelectedExercise(exercise);
    if (player.currentExercise?.id !== exercise.id) {
      player.loadExercise(exercise);
    }
  }, [player]);

  const handleMarkComplete = useCallback(() => {
    if (!selectedExercise) return;
    const duration = practiceStartTime
      ? Math.round((Date.now() - practiceStartTime) / 1000)
      : 0;
    practiceLog.markComplete(selectedExercise.id, player.bpm, duration);
    player.stop();
    setPracticeStartTime(null);
  }, [selectedExercise, player, practiceLog, practiceStartTime]);

  const totalPracticed = new Set(practiceLog.entries.filter(e => e.completed).map(e => e.exerciseId)).size;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 py-2 sm:px-6"
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
          zIndex: 50,
        }}
      >
        {/* Left: back link + title */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="p-2 rounded transition-colors"
            style={{ color: 'var(--text-muted)' }}
            title={t.practice.backToMetronome}
          >
            <ChevronLeft size={18} />
          </Link>
          <h1
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono), monospace' }}
          >
            {t.practice.title}
          </h1>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSkinPicker(v => !v)}
            className="p-2 rounded transition-colors hidden sm:flex"
            style={{
              color: showSkinPicker ? 'var(--accent-primary)' : 'var(--text-muted)',
              backgroundColor: showSkinPicker ? 'var(--accent-dim)' : 'transparent',
            }}
            title={t.header.skin}
          >
            <Palette size={18} />
          </button>
          <button
            onClick={toggleMode}
            className="p-2 rounded transition-colors hidden sm:flex"
            style={{ color: 'var(--text-muted)' }}
            title={mode === 'light' ? t.header.darkMode : t.header.lightMode}
          >
            {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={cycleLocale}
            className="p-2 rounded transition-colors hidden sm:flex items-center gap-1"
            style={{ color: 'var(--text-muted)' }}
            title={t.header.language}
          >
            <Languages size={16} />
            <span className="text-[10px] leading-none" style={{ fontFamily: 'var(--font-mono), monospace' }}>
              {LOCALE_LABELS[locale]}
            </span>
          </button>

          {/* Mobile more menu */}
          <div className="relative sm:hidden" ref={moreMenuRef}>
            <button
              onClick={() => setShowMoreMenu(v => !v)}
              className="p-2 rounded transition-colors"
              style={{
                color: showMoreMenu ? 'var(--accent-primary)' : 'var(--text-muted)',
                backgroundColor: showMoreMenu ? 'var(--accent-dim)' : 'transparent',
              }}
            >
              <MoreHorizontal size={18} />
            </button>
            {showMoreMenu && (
              <div
                className="absolute right-0 top-full mt-1 py-1 rounded-lg shadow-lg min-w-[160px] z-50"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => { setShowSkinPicker(v => !v); setShowMoreMenu(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Palette size={16} /> {t.header.skin}
                </button>
                <button
                  onClick={() => { toggleMode(); setShowMoreMenu(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {mode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                  {mode === 'light' ? t.header.darkMode : t.header.lightMode}
                </button>
                <button
                  onClick={() => { cycleLocale(); setShowMoreMenu(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Languages size={16} /> {t.header.language} ({LOCALE_LABELS[locale]})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Skin picker dropdown */}
        {showSkinPicker && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowSkinPicker(false)} />
            <div
              className="absolute left-0 right-0 z-50 px-4 sm:px-6 pt-2 pb-4"
              style={{
                top: '100%',
                backgroundColor: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-subtle)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }}
            >
              <SkinPicker
                skinId={skinId}
                mode={mode}
                onSkinChange={changeSkin}
                onToggleMode={toggleMode}
              />
            </div>
          </>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-6 py-4 pb-20 max-w-6xl mx-auto w-full">
        {/* Progress dashboard */}
        <div className="mb-6">
          <ProgressDashboard
            streak={practiceLog.streak}
            completedToday={practiceLog.completedToday.size}
            totalPracticed={totalPracticed}
            daysMap={practiceLog.daysMap}
          />
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 mb-4">
          <button
            onClick={() => setActiveTab('today')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
            style={{
              backgroundColor: activeTab === 'today' ? 'var(--accent-primary)' : 'var(--bg-control)',
              color: activeTab === 'today' ? '#fff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono), monospace',
            }}
          >
            <Music size={14} />
            {t.practice.todayTab}
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
            style={{
              backgroundColor: activeTab === 'library' ? 'var(--accent-primary)' : 'var(--bg-control)',
              color: activeTab === 'library' ? '#fff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono), monospace',
            }}
          >
            <BookOpen size={14} />
            {t.practice.libraryTab}
          </button>
        </div>

        {/* Content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: exercise list */}
          <div className="lg:col-span-2">
            {activeTab === 'today' ? (
              <TodayPlan
                exercises={recommendation.exercises}
                completedToday={practiceLog.completedToday}
                getMaxBpm={practiceLog.getMaxBpm}
                playingExerciseId={player.currentExercise?.id ?? null}
                isPlaying={player.isPlaying}
                onPlayExercise={handlePlayExercise}
                onStopExercise={handleStopExercise}
                onSelectExercise={handleSelectExercise}
                onRefresh={recommendation.refresh}
              />
            ) : (
              <ExerciseBrowser
                completedToday={practiceLog.completedToday}
                getMaxBpm={practiceLog.getMaxBpm}
                playingExerciseId={player.currentExercise?.id ?? null}
                isPlaying={player.isPlaying}
                onPlayExercise={handlePlayExercise}
                onStopExercise={handleStopExercise}
                onSelectExercise={handleSelectExercise}
              />
            )}
          </div>

          {/* Right: exercise detail */}
          <div className="lg:col-span-1">
            {selectedExercise ? (
              <ExerciseDetail
                exercise={selectedExercise}
                isPlaying={player.isPlaying && player.currentExercise?.id === selectedExercise.id}
                currentNoteIndex={player.currentExercise?.id === selectedExercise.id ? player.currentNoteIndex : -1}
                bpm={player.currentExercise?.id === selectedExercise.id ? player.bpm : selectedExercise.defaultBpm}
                maxBpm={practiceLog.getMaxBpm(selectedExercise.id)}
                isCompleted={practiceLog.completedToday.has(selectedExercise.id)}
                onPlay={() => handlePlayExercise(selectedExercise)}
                onStop={handleStopExercise}
                onBpmChange={player.setBpm}
                onMarkComplete={handleMarkComplete}
              />
            ) : (
              <div
                className="rounded-lg p-8 text-center"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <Music size={32} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                <p
                  className="text-sm"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono), monospace' }}
                >
                  {t.practice.selectExercise}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mini metronome sticky bar */}
      <MiniMetronome />

      {/* Footer */}
      <footer
        className="text-center py-3 text-xs pb-16"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        {t.practice.footerHint}
      </footer>
    </div>
  );
}

export default function PracticePage() {
  return (
    <I18nProvider>
      <PracticeContent />
    </I18nProvider>
  );
}
