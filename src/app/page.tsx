'use client';

import { useState, useEffect, useRef } from 'react';
import { useMetronome } from '@/hooks/useMetronome';

import { useKeyboard } from '@/hooks/useKeyboard';

import BpmDisplay from '@/components/metronome/BpmDisplay';
import BeatVisualizer from '@/components/metronome/BeatVisualizer';
import TransportBar from '@/components/metronome/TransportBar';

import SubdivisionPicker from '@/components/metronome/SubdivisionPicker';
import TimeSigPicker from '@/components/metronome/TimeSigPicker';
import SoundPicker from '@/components/metronome/SoundPicker';
import AccentEditor from '@/components/metronome/AccentEditor';
import PulseBar from '@/components/metronome/PulseBar';
import TempoTrainer from '@/components/metronome/TempoTrainer';
import TimerPanel from '@/components/metronome/TimerPanel';

import {
  Zap,
  Keyboard,
  Sun,
  Moon,
  Palette,
  Volume2,
  VolumeX,
  X,
  Eye,
  EyeOff,
  TrendingUp,
  Timer,
} from 'lucide-react';
import { useSkin } from '@/hooks/useSkin';
import SkinPicker from '@/components/metronome/SkinPicker';

type HeaderPanel = 'trainer' | 'timer' | 'skin' | null;

/* ── Flash Mode overlay ── */
function FlashModeOverlay({
  bpm,
  currentBeat,
  beatsPerBar,
  flashBeat,
  isPlaying,
  onClose,
}: {
  bpm: number;
  currentBeat: number;
  beatsPerBar: number;
  flashBeat: number | null;
  isPlaying: boolean;
  onClose: () => void;
}) {
  const isFlashing = isPlaying && flashBeat !== null;
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none"
      style={{
        backgroundColor: isFlashing ? 'var(--accent-primary)' : 'var(--bg-primary)',
        transition: 'background-color 0.08s ease-out',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-3 rounded-lg transition-colors"
        style={{
          color: isFlashing ? '#fff' : 'var(--text-muted)',
          backgroundColor: isFlashing ? 'rgba(0,0,0,0.2)' : 'var(--bg-control)',
        }}
      >
        <X size={24} />
      </button>

      {/* BPM */}
      <div
        style={{
          fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
          fontSize: 'clamp(120px, 25vw, 240px)',
          lineHeight: 1,
          color: isFlashing ? '#fff' : 'var(--text-primary)',
          transition: 'color 0.08s ease-out',
        }}
      >
        {bpm}
      </div>

      {/* Beat dots */}
      <div className="flex gap-4 mt-6">
        {Array.from({ length: beatsPerBar }).map((_, i) => {
          const isActive = isPlaying && currentBeat === i;
          const isDownbeat = i === 0;
          return (
            <div
              key={i}
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: isActive
                  ? isDownbeat
                    ? 'var(--beat-downbeat)'
                    : isFlashing ? '#fff' : 'var(--accent-primary)'
                  : isFlashing ? 'rgba(255,255,255,0.3)' : 'var(--bg-control)',
                transition: 'background-color 0.08s ease-out',
                boxShadow: isActive && isDownbeat ? '0 0 16px var(--beat-downbeat)' : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Hint */}
      <div
        className="absolute bottom-6 text-xs"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          color: isFlashing ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)',
        }}
      >
        点击 × 或按 ESC 退出
      </div>
    </div>
  );
}

export default function Home() {
  const metronome = useMetronome();
  const { state } = metronome;

  const [openPanel, setOpenPanel] = useState<HeaderPanel>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { skinId, mode, changeSkin, toggleMode } = useSkin();
  const [isFlashMode, setIsFlashMode] = useState(false);
  const [visualMute, setVisualMute] = useState(false);

  // Read visualMute from storage after mount
  useEffect(() => {
    setVisualMute(localStorage.getItem('metronome-visual-mute') === 'true');
  }, []);

  // Sync visualMute to localStorage (skip initial render to avoid overwriting stored value)
  const visualMuteMounted = useRef(false);
  useEffect(() => {
    if (!visualMuteMounted.current) { visualMuteMounted.current = true; return; }
    localStorage.setItem('metronome-visual-mute', String(visualMute));
  }, [visualMute]);

  // Keyboard shortcuts
  useKeyboard({
    toggle: metronome.toggle,
    setBpm: metronome.setBpm,
    bpm: state.bpm,
  });

  // ESC to close flash mode
  useEffect(() => {
    if (!isFlashMode) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFlashMode(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFlashMode]);

  // WakeLock
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;

    const requestWakeLock = async () => {
      if (state.isPlaying && 'wakeLock' in navigator) {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
        } catch {
          // ignore
        }
      }
    };

    if (state.isPlaying) {
      requestWakeLock();
    }

    return () => {
      wakeLock?.release();
    };
  }, [state.isPlaying]);

  // Edge flash effect
  const showEdgeFlash = !visualMute && state.isPlaying && state.flashBeat !== null;

  // Visual state — when muted, suppress beat animations
  const visualFlashBeat = visualMute ? null : state.flashBeat;
  const visualIsPlaying = visualMute ? false : state.isPlaying;

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundColor: 'var(--bg-primary)',
        animation: showEdgeFlash ? 'edge-flash 0.5s ease-out' : 'none',
      }}
    >
      {/* Flash Mode overlay */}
      {isFlashMode && (
        <FlashModeOverlay
          bpm={state.bpm}
          currentBeat={state.currentBeat}
          beatsPerBar={state.beatsPerBar}
          flashBeat={visualFlashBeat}
          isPlaying={state.isPlaying}
          onClose={() => setIsFlashMode(false)}
        />
      )}

      {/* Pulse bar */}
      <PulseBar
        isPlaying={visualIsPlaying}
        flashBeat={visualFlashBeat}
        currentBeat={state.currentBeat}
        isDownbeat={state.currentBeat === 0}
      />

      {/* Header */}
      <header
        className="flex items-center justify-between px-4 py-2 sm:px-6"
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
          zIndex: 50,
        }}
      >
        {/* Logo — animated metronome pendulum */}
        <div className="flex items-center" style={{ width: 28, height: 28 }}>
          <svg
            viewBox="0 0 28 28"
            width="28"
            height="28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="节拍器"
          >
            {/* Metronome body — trapezoid */}
            <path
              d="M7 24 L10 6 L18 6 L21 24 Z"
              fill="none"
              stroke="var(--text-secondary)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Base bottom line */}
            <line
              x1="6" y1="24" x2="22" y2="24"
              stroke="var(--text-secondary)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Pendulum rod — pivots from center top of body */}
            <line
              x1="14" y1="7"
              x2="14" y2="21"
              stroke="var(--accent-primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{
                transformOrigin: '14px 7px',
                animation: state.isPlaying
                  ? 'pendulum-swing 0.5s ease-in-out infinite alternate'
                  : 'none',
              }}
            />
            {/* Pendulum weight */}
            <circle
              cx="14" cy="19"
              r="2"
              fill="var(--accent-primary)"
              style={{
                transformOrigin: '14px 7px',
                animation: state.isPlaying
                  ? 'pendulum-swing 0.5s ease-in-out infinite alternate'
                  : 'none',
              }}
            />
          </svg>
          <style>{`
            @keyframes pendulum-swing {
              from { transform: rotate(-22deg); }
              to   { transform: rotate(22deg); }
            }
          `}</style>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOpenPanel(p => p === 'trainer' ? null : 'trainer')}
            className="p-2 rounded transition-colors relative"
            style={{
              color: (openPanel === 'trainer' || metronome.tempoTrainer.enabled) ? 'var(--accent-primary)' : 'var(--text-muted)',
              backgroundColor: (openPanel === 'trainer' || metronome.tempoTrainer.enabled) ? 'var(--accent-dim)' : 'transparent',
            }}
            title="速度训练"
          >
            <TrendingUp size={18} />
            {metronome.tempoTrainer.enabled && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }} />
            )}
          </button>
          <button
            onClick={() => setOpenPanel(p => p === 'timer' ? null : 'timer')}
            className="p-2 rounded transition-colors flex items-center gap-1"
            style={{
              color: (openPanel === 'timer' || metronome.timer.enabled) ? 'var(--accent-primary)' : 'var(--text-muted)',
              backgroundColor: (openPanel === 'timer' || metronome.timer.enabled) ? 'var(--accent-dim)' : 'transparent',
            }}
            title="计时器"
          >
            <Timer size={18} />
            {metronome.timer.enabled && (
              <span
                className="text-[10px] leading-none tabular-nums"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                {Math.floor(metronome.timer.remainingSeconds / 60)}:{(metronome.timer.remainingSeconds % 60).toString().padStart(2, '0')}
              </span>
            )}
          </button>
          <button
            onClick={() => setVisualMute(v => !v)}
            className="p-2 rounded transition-colors"
            style={{
              color: visualMute ? 'var(--accent-primary)' : 'var(--text-muted)',
              backgroundColor: visualMute ? 'var(--accent-dim)' : 'transparent',
            }}
            title={visualMute ? '开启视觉效果' : '关闭视觉效果'}
          >
            {visualMute ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button
            onClick={() => setOpenPanel(p => p === 'skin' ? null : 'skin')}
            className="p-2 rounded transition-colors"
            style={{
              color: openPanel === 'skin' ? 'var(--accent-primary)' : 'var(--text-muted)',
              backgroundColor: openPanel === 'skin' ? 'var(--accent-dim)' : 'transparent',
            }}
            title="皮肤"
          >
            <Palette size={18} />
          </button>
          <button
            onClick={toggleMode}
            className="p-2 rounded transition-colors"
            style={{ color: 'var(--text-muted)' }}
            title={mode === 'light' ? '切换暗色主题' : '切换亮色主题'}
          >
            {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="p-2 rounded transition-colors hidden sm:flex"
            style={{
              color: showShortcuts ? 'var(--accent-primary)' : 'var(--text-muted)',
              backgroundColor: showShortcuts ? 'var(--accent-dim)' : 'transparent',
            }}
            title="键盘快捷键"
          >
            <Keyboard size={18} />
          </button>
          <button
            onClick={() => setIsFlashMode(true)}
            className="p-2 rounded transition-colors"
            style={{
              color: isFlashMode ? 'var(--accent-primary)' : 'var(--text-muted)',
              backgroundColor: isFlashMode ? 'var(--accent-dim)' : 'transparent',
            }}
            title="闪烁模式"
          >
            <Zap size={18} />
          </button>
        </div>

        {/* Dropdown panels - positioned absolute below header */}
        {openPanel && (
          <>
            {/* Backdrop to close on click outside */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpenPanel(null)}
            />
            <div
              className="absolute left-0 right-0 z-50 px-4 sm:px-6 pt-2 pb-4"
              style={{
                top: '100%',
                backgroundColor: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-subtle)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }}
            >
              {openPanel === 'trainer' && (
                <TempoTrainer
                  config={metronome.tempoTrainer}
                  currentBpm={state.bpm}
                  onChange={metronome.setTempoTrainer}
                />
              )}
              {openPanel === 'timer' && (
                <TimerPanel
                  config={metronome.timer}
                  onChange={metronome.setTimer}
                />
              )}
              {openPanel === 'skin' && (
                <SkinPicker
                  skinId={skinId}
                  mode={mode}
                  onSkinChange={changeSkin}
                  onToggleMode={toggleMode}
                />
              )}
            </div>
          </>
        )}
      </header>

      {/* Keyboard shortcuts overlay */}
      {showShortcuts && (
        <div
          className="mx-4 sm:mx-6 mt-2 p-3 rounded-lg text-xs"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-mono), monospace',
            color: 'var(--text-secondary)',
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <span>
              <kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-control)' }}>空格</kbd> 播放/停止
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-control)' }}>↑/↓</kbd> BPM ±1
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-control)' }}>Shift+↑/↓</kbd> ±5
            </span>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-8 gap-6 sm:gap-8">
        {/* BPM Display */}
        <BpmDisplay
          bpm={state.bpm}
          flashBeat={visualFlashBeat}
          isPlaying={state.isPlaying}
          onBpmChange={metronome.setBpm}
          skinId={skinId}
        />

        {/* Beat Visualizer */}
        <div className="flex flex-col items-center gap-4">
          <BeatVisualizer
            beatsPerBar={state.beatsPerBar}
            currentBeat={state.currentBeat}
            accents={state.accents}
            isPlaying={state.isPlaying}
            visualMute={visualMute}
            onToggleAccent={metronome.toggleAccent}
          />
          <AccentEditor
            accents={state.accents}
            onToggleAccent={metronome.toggleAccent}
          />
        </div>

        {/* BPM slider */}
        <div className="w-full max-w-sm flex items-center gap-3 px-2">
          <button
            onClick={() => metronome.setBpm(state.bpm - 1)}
            className="w-7 h-7 flex items-center justify-center rounded transition-all active:scale-95 flex-shrink-0"
            style={{
              backgroundColor: 'var(--bg-control)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '16px',
            }}
          >−</button>
          <input
            type="range"
            min="1"
            max="300"
            value={state.bpm}
            onChange={(e) => metronome.setBpm(parseInt(e.target.value))}
            className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${
                ((state.bpm - 1) / 299) * 100
              }%, var(--bg-control) ${((state.bpm - 1) / 299) * 100}%, var(--bg-control) 100%)`,
              accentColor: 'var(--accent-primary)',
            }}
          />
          <button
            onClick={() => metronome.setBpm(state.bpm + 1)}
            className="w-7 h-7 flex items-center justify-center rounded transition-all active:scale-95 flex-shrink-0"
            style={{
              backgroundColor: 'var(--bg-control)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '16px',
            }}
          >+</button>
        </div>

        {/* Transport: Play/Stop */}
        <TransportBar
          isPlaying={state.isPlaying}
          bpm={state.bpm}
          onToggle={metronome.toggle}
          onBpmChange={metronome.setBpm}
        />

        {/* Control bar: TimeSig, Subdivision, Sound, Volume */}
        <div
          className="skin-control-panel w-full max-w-6xl rounded-lg p-4 sm:p-6 relative overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {/* Classical: bottom corner flourishes */}
          {skinId === 'classical' && (
            <>
              <span
                className="absolute pointer-events-none"
                style={{
                  bottom: 6, left: 6, width: 20, height: 20,
                  borderBottom: '2px solid var(--accent-primary)',
                  borderLeft: '2px solid var(--accent-primary)',
                  opacity: 0.4,
                }}
              />
              <span
                className="absolute pointer-events-none"
                style={{
                  bottom: 6, right: 6, width: 20, height: 20,
                  borderBottom: '2px solid var(--accent-primary)',
                  borderRight: '2px solid var(--accent-primary)',
                  opacity: 0.4,
                }}
              />
            </>
          )}
          {/* Pixel: corner brick block ornaments */}
          {skinId === 'pixel' && (
            <>
              {/* Top-left mini brick */}
              <span className="absolute pointer-events-none" style={{ top: 4, left: 4 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
                  <rect width="16" height="16" fill="var(--accent-secondary)" opacity="0.5" />
                  <rect width="16" height="1" fill="var(--accent-primary)" opacity="0.4" />
                  <rect width="1" height="16" fill="var(--accent-primary)" opacity="0.4" />
                  <rect x="8" y="0" width="1" height="8" fill="var(--bg-primary)" opacity="0.3" />
                  <rect x="0" y="8" width="16" height="1" fill="var(--bg-primary)" opacity="0.3" />
                  <rect x="4" y="8" width="1" height="8" fill="var(--bg-primary)" opacity="0.3" />
                  <rect x="12" y="8" width="1" height="8" fill="var(--bg-primary)" opacity="0.3" />
                </svg>
              </span>
              {/* Top-right mini brick */}
              <span className="absolute pointer-events-none" style={{ top: 4, right: 4 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
                  <rect width="16" height="16" fill="var(--accent-secondary)" opacity="0.5" />
                  <rect y="0" width="16" height="1" fill="var(--accent-primary)" opacity="0.4" />
                  <rect x="15" width="1" height="16" fill="var(--accent-primary)" opacity="0.4" />
                  <rect x="8" y="0" width="1" height="8" fill="var(--bg-primary)" opacity="0.3" />
                  <rect x="0" y="8" width="16" height="1" fill="var(--bg-primary)" opacity="0.3" />
                  <rect x="4" y="8" width="1" height="8" fill="var(--bg-primary)" opacity="0.3" />
                  <rect x="12" y="8" width="1" height="8" fill="var(--bg-primary)" opacity="0.3" />
                </svg>
              </span>
              {/* Bottom-left coin */}
              <span className="absolute pointer-events-none" style={{ bottom: 6, left: 6 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" style={{ imageRendering: 'pixelated' }}>
                  <rect x="3" y="0" width="4" height="10" fill="var(--accent-primary)" opacity="0.5" />
                  <rect x="1" y="2" width="2" height="6" fill="var(--accent-primary)" opacity="0.5" />
                  <rect x="7" y="2" width="2" height="6" fill="var(--accent-primary)" opacity="0.5" />
                  <rect x="4" y="1" width="1" height="1" fill="#fff" opacity="0.4" />
                </svg>
              </span>
              {/* Bottom-right coin */}
              <span className="absolute pointer-events-none" style={{ bottom: 6, right: 6 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" style={{ imageRendering: 'pixelated' }}>
                  <rect x="3" y="0" width="4" height="10" fill="var(--accent-primary)" opacity="0.5" />
                  <rect x="1" y="2" width="2" height="6" fill="var(--accent-primary)" opacity="0.5" />
                  <rect x="7" y="2" width="2" height="6" fill="var(--accent-primary)" opacity="0.5" />
                  <rect x="4" y="1" width="1" height="1" fill="#fff" opacity="0.4" />
                </svg>
              </span>
            </>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <TimeSigPicker
              beatsPerBar={state.beatsPerBar}
              beatUnit={state.beatUnit}
              onBeatsChange={metronome.setBeatsPerBar}
              onBeatUnitChange={metronome.setBeatUnit}
            />
            <SubdivisionPicker
              subdivision={state.subdivision}
              onChange={metronome.setSubdivision}
            />
            <SoundPicker
              sound={state.sound}
              accentSound={state.accentSound}
              onChange={metronome.setSound}
              onAccentSoundChange={metronome.setAccentSound}
            />
            {/* Volume */}
            <div className="flex flex-col gap-2">
              <label
                className="text-xs uppercase tracking-wider"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'var(--text-muted)',
                }}
              >
                音量
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => metronome.setVolume(state.volume === 0 ? 1 : 0)}
                  className="flex-shrink-0"
                  style={{ color: state.volume === 0 ? 'var(--text-muted)' : 'var(--text-secondary)' }}
                >
                  {state.volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={state.volume}
                  onChange={(e) => metronome.setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${
                      state.volume * 100
                    }%, var(--bg-control) ${state.volume * 100}%, var(--bg-control) 100%)`,
                    accentColor: 'var(--accent-primary)',
                  }}
                />
                <span
                  className="w-8 text-right flex-shrink-0 text-[10px]"
                  style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--text-muted)' }}
                >{Math.round(state.volume * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="text-center py-3 text-xs"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        空格键 播放/停止 · ↑↓ 调整 BPM
      </footer>
    </div>
  );
}
