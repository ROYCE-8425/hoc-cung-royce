import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlashcardsStore } from '@/stores/useFlashcardsStore';
import { useGamificationStore } from '@/stores/useGamificationStore';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ClozeRenderer } from '@/components/ClozeRenderer';
import { speakTextWithAI, PREMIUM_VOICES, stopSpeech } from '@/services/tts';
import { ImageOcclusionViewer } from '@/components/ImageOcclusionViewer';
import { cn } from '@/lib/utils';
import type { OcclusionRegion } from '@/types';
import { hasClozeMarkers } from '@/types';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Trophy,
  Target,
  Brain,
  ChevronLeft,
  SkipForward,
  Zap,
  Settings2,
  Volume2,
  VolumeX,
  Shuffle,
  Languages,
  Mic,
  X,
} from 'lucide-react';

// SM-2 Quality ratings
const qualityRatings = [
  { quality: 1 as const, labelKey: 'studySession.again', descKey: 'studySession.againDesc', icon: XCircle, color: 'bg-red-500' },
  { quality: 2 as const, labelKey: 'studySession.hard', descKey: 'studySession.hardDesc', icon: ThumbsDown, color: 'bg-orange-500' },
  { quality: 3 as const, labelKey: 'studySession.good', descKey: 'studySession.goodDesc', icon: ThumbsUp, color: 'bg-amber-500' },
  { quality: 4 as const, labelKey: 'studySession.easy', descKey: 'studySession.easyDesc', icon: CheckCircle, color: 'bg-green-500' },
  { quality: 5 as const, labelKey: 'studySession.perfect', descKey: 'studySession.perfectDesc', icon: Sparkles, color: 'bg-emerald-500' },
];

function FlipCard({
  front,
  back,
  notes,
  isFlipped,
  onFlip,
}: {
  front: string;
  back: string;
  notes?: string;
  isFlipped: boolean;
  onFlip: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div
      className="relative w-full max-w-xl mx-auto h-48 md:h-56 cursor-pointer perspective-1000"
      onClick={onFlip}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className={cn(
            'absolute inset-0 w-full h-full rounded-2xl border-2 border-border bg-card p-6 flex flex-col items-center justify-center backface-hidden',
            !isFlipped && 'shadow-lg'
          )}
        >
          <span className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            {t('studySession.question')}
          </span>
          <p className="text-lg md:text-xl font-medium text-center line-clamp-4">{front}</p>
          <p className="text-xs text-muted-foreground mt-3 opacity-60">{t('studySession.tapToFlip')}</p>
        </div>

        {/* Back */}
        <div
          className={cn(
            'absolute inset-0 w-full h-full rounded-2xl border-2 border-green-500/50 bg-card p-6 flex flex-col items-center justify-center backface-hidden',
            isFlipped && 'shadow-lg'
          )}
          style={{ transform: 'rotateY(180deg)' }}
        >
          <span className="text-xs uppercase tracking-wider text-green-500 mb-2">
            {t('studySession.answer')}
          </span>
          <p className="text-lg md:text-xl font-medium text-center line-clamp-3">{back}</p>
          {notes && (
            <p className="text-xs text-muted-foreground mt-2 text-center line-clamp-2">{notes}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function SessionComplete({
  stats,
  studySetId,
  onRestart,
  xpEarned,
}: {
  stats: { reviewed: number; correct: number; incorrect: number };
  studySetId: string;
  onRestart: () => void;
  xpEarned: number;
}) {
  const { t } = useTranslation();
  const accuracy = stats.reviewed > 0 ? Math.round((stats.correct / stats.reviewed) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-md mx-auto"
    >
      <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
        <Trophy className="w-10 h-10 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2">{t('studySession.sessionComplete')}</h2>
      <p className="text-muted-foreground mb-4">{t('studySession.greatJobReviewing')}</p>

      {xpEarned > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6"
        >
          <Zap className="w-5 h-5 text-green-500" />
          <span className="font-bold text-green-600 dark:text-green-400">{t('studySession.xpEarned', { xp: xpEarned })}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
            <Brain className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{stats.reviewed}</p>
          <p className="text-xs text-muted-foreground">{t('studySession.reviewed')}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{stats.correct}</p>
          <p className="text-xs text-muted-foreground">{t('studySession.correct')}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mx-auto mb-2">
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold">{stats.incorrect}</p>
          <p className="text-xs text-muted-foreground">{t('studySession.incorrect')}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Target className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium">{t('studySession.accuracy')}</span>
        </div>
        <p className="text-4xl font-bold">{accuracy}%</p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" asChild>
          <Link to={`/dashboard/study-sets/${studySetId}`}>{t('studySession.backToSet')}</Link>
        </Button>
        <Button className="flex-1 bg-green-500 hover:bg-green-600" onClick={onRestart}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t('studySession.studyAgain')}
        </Button>
      </div>
    </motion.div>
  );
}

// Fisher-Yates shuffle
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

function cleanSpeechText(text: string): string {
  return text
    .replace(/\{\{(.+?)\}\}/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getStoredValue(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return window.localStorage.getItem(key) ?? fallback;
}

function setStoredValue(key: string, value: string | boolean) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, String(value));
}

const studySettingsStorage = {
  autoSpeak: 'studySession.autoSpeak',
  shuffle: 'studySession.shuffle',
  questionLang: 'studySession.questionLang',
  selectedVoiceURI: 'studySession.selectedVoiceURI',
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return target.isContentEditable || tagName === 'input' || tagName === 'select' || tagName === 'textarea';
}

export function StudySessionPage() {
  const { t } = useTranslation();
  const { id: studySetId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    flashcards,
    studyQueue,
    currentStudyIndex,
    isFlipped,
    sessionStats,
    isLoading,
    fetchFlashcards,
    startStudySession,
    flipCard,
    nextCard,
    prevCard,
    reviewFlashcard,
    resetSession,
  } = useFlashcardsStore();
  const { addXP } = useGamificationStore();

  const [isReviewing, setIsReviewing] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);
  const [clozeRevealed, setClozeRevealed] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(() => getStoredValue(studySettingsStorage.autoSpeak, 'false') === 'true');
  const [isShuffled, setIsShuffled] = useState(() => getStoredValue(studySettingsStorage.shuffle, 'false') === 'true');
  const [questionLang, setQuestionLang] = useState<'en' | 'vi'>(() =>
    getStoredValue(studySettingsStorage.questionLang, 'en') === 'vi' ? 'vi' : 'en'
  );
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(() =>
    getStoredValue(studySettingsStorage.selectedVoiceURI, '')
  );
  const prevSpokenKeyRef = useRef<string | null>(null);

  // ── Load browser voices ──
  useEffect(() => {
    const loadVoices = () => {
      const isPremium = PREMIUM_VOICES.some((v) => v.id === selectedVoiceURI);
      
      let voices: SpeechSynthesisVoice[] = [];
      let enVoices: SpeechSynthesisVoice[] = [];
      
      if (isSpeechSupported()) {
        voices = window.speechSynthesis.getVoices();
        enVoices = voices.filter((v) => v.lang.startsWith('en'));
        setAvailableVoices(enVoices.length > 0 ? enVoices : voices);
      }

      const selectedStillExists = isPremium || voices.some((v) => v.voiceURI === selectedVoiceURI);

      if (!selectedVoiceURI || !selectedStillExists) {
        // Default to a premium AI voice: en-US-AriaNeural
        const preferred = 'en-US-AriaNeural';
        setSelectedVoiceURI(preferred);
        setStoredValue(studySettingsStorage.selectedVoiceURI, preferred);
      }
    };

    loadVoices();
    if (isSpeechSupported()) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (isSpeechSupported()) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [selectedVoiceURI]);

  // ── Speak helper ──
  const speakText = useCallback(
    (text: string) => {
      const cleanText = cleanSpeechText(text);
      if (!cleanText) return;
      speakTextWithAI(cleanText, selectedVoiceURI, 0.9);
    },
    [selectedVoiceURI]
  );

  useEffect(() => {
    if (studySetId) {
      fetchFlashcards(studySetId).then(() => {
        // Will be started after flashcards are loaded
      });
    }

    return () => {
      stopSpeech();
      resetSession();
    };
  }, [studySetId, fetchFlashcards, resetSession]);

  useEffect(() => {
    if (flashcards.length > 0 && studyQueue.length === 0) {
      startStudySession(isShuffled ? shuffleArray(flashcards) : flashcards);
    }
  }, [flashcards, studyQueue.length, startStudySession, isShuffled]);

  const currentCard = studyQueue[currentStudyIndex];
  const isSessionComplete = currentStudyIndex >= studyQueue.length && studyQueue.length > 0;
  const progress = studyQueue.length > 0 ? ((currentStudyIndex) / studyQueue.length) * 100 : 0;

  // ── Auto speak when card changes ──
  useEffect(() => {
    if (autoSpeak && currentCard) {
      const speakKey = `${currentCard.id}:${questionLang}`;
      if (speakKey === prevSpokenKeyRef.current) return;
      prevSpokenKeyRef.current = speakKey;
      const englishText = questionLang === 'en' ? currentCard.front : currentCard.back;
      speakText(englishText);
    }
  }, [autoSpeak, currentCard, questionLang, speakText]);

  // ── Resolve displayed front/back based on language setting ──
  const getDisplayCard = (card: { front: string; back: string }) => {
    if (questionLang === 'vi') {
      return { front: card.back, back: card.front };
    }
    return { front: card.front, back: card.back };
  };

  const handleRate = async (quality: 1 | 2 | 3 | 4 | 5) => {
    if (!currentCard || isReviewing) return;

    setIsReviewing(true);
    try {
      await reviewFlashcard(currentCard.id, { quality });
      const xp = await addXP('card_review');
      setSessionXp((prev) => prev + xp);
      setClozeRevealed(false);
      nextCard();
    } finally {
      setIsReviewing(false);
    }
  };

  const handleRestart = () => {
    startStudySession(isShuffled ? shuffleArray(flashcards) : flashcards);
  };

  const handleToggleShuffle = () => {
    const nextShuffle = !isShuffled;
    setIsShuffled(nextShuffle);
    setStoredValue(studySettingsStorage.shuffle, nextShuffle);

    if (nextShuffle) {
      startStudySession(shuffleArray(flashcards));
    } else {
      startStudySession(flashcards);
    }
  };

  const handleAutoSpeakChange = () => {
    const nextAutoSpeak = !autoSpeak;
    setAutoSpeak(nextAutoSpeak);
    setStoredValue(studySettingsStorage.autoSpeak, nextAutoSpeak);
  };

  const handleQuestionLangChange = (nextQuestionLang: 'en' | 'vi') => {
    setQuestionLang(nextQuestionLang);
    setStoredValue(studySettingsStorage.questionLang, nextQuestionLang);
    prevSpokenKeyRef.current = null;
  };

  const handleVoiceChange = (voiceURI: string) => {
    setSelectedVoiceURI(voiceURI);
    setStoredValue(studySettingsStorage.selectedVoiceURI, voiceURI);
  };

  const handleSpeakCurrentCard = useCallback(() => {
    if (!currentCard) return;
    const englishText = questionLang === 'en' ? currentCard.front : currentCard.back;
    speakText(englishText);
  }, [currentCard, questionLang, speakText]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (isSessionComplete || isTypingTarget(event.target)) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (currentStudyIndex > 0) prevCard();
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (currentStudyIndex < studyQueue.length - 1) nextCard();
        return;
      }

      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        const cardType = currentCard?.type || (currentCard && hasClozeMarkers(currentCard.front) ? 'cloze' : 'standard');
        if (cardType === 'standard') flipCard();
        return;
      }

      if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        handleSpeakCurrentCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentCard,
    currentStudyIndex,
    flipCard,
    handleSpeakCurrentCard,
    isSessionComplete,
    nextCard,
    prevCard,
    studyQueue.length,
  ]);

  if (isLoading && flashcards.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Spinner className="w-8 h-8" />
        </div>
      </DashboardLayout>
    );
  }

  if (flashcards.length === 0) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{t('studySession.noFlashcards')}</p>
          <Button variant="outline" onClick={() => navigate(`/dashboard/study-sets/${studySetId}`)}>
            {t('studySession.backToStudySet')}
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto h-[calc(100vh-120px)] flex flex-col relative">
        {/* ── Settings Drawer ── */}
        <AnimatePresence>
          {settingsOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute top-0 right-0 bottom-0 w-80 bg-card border-l border-border z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-5 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    {t('studySession.settings', 'Study settings')}
                  </h3>
                  <button onClick={() => setSettingsOpen(false)} className="p-1 rounded-lg hover:bg-muted transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Auto Pronounce */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm flex items-center gap-2">
                      {autoSpeak ? <Volume2 className="w-4 h-4 text-green-500" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
                      {t('studySession.autoSpeak', 'Auto speak')}
                    </span>
                    <button
                      onClick={handleAutoSpeakChange}
                      className={cn(
                        'relative w-11 h-6 rounded-full transition-colors',
                        autoSpeak ? 'bg-green-500' : 'bg-muted'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                          autoSpeak && 'translate-x-5'
                        )}
                      />
                    </button>
                  </label>
                  <p className="text-xs text-muted-foreground">{t('studySession.autoSpeakDesc', 'Read the English side automatically when the card changes.')}</p>
                </div>

                {/* Shuffle */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm flex items-center gap-2">
                      <Shuffle className={cn('w-4 h-4', isShuffled ? 'text-green-500' : 'text-muted-foreground')} />
                      {t('studySession.shuffle', 'Shuffle cards')}
                    </span>
                    <button
                      onClick={handleToggleShuffle}
                      className={cn(
                        'relative w-11 h-6 rounded-full transition-colors',
                        isShuffled ? 'bg-green-500' : 'bg-muted'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                          isShuffled && 'translate-x-5'
                        )}
                      />
                    </button>
                  </label>
                  <p className="text-xs text-muted-foreground">{t('studySession.shuffleDesc', 'Randomize the cards in this study session.')}</p>
                </div>

                {/* Question Language */}
                <div className="space-y-2">
                  <span className="text-sm flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    {t('studySession.questionLang', 'Question side')}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleQuestionLangChange('en')}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all',
                        questionLang === 'en'
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-muted border-border hover:bg-muted/80'
                      )}
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleQuestionLangChange('vi')}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all',
                        questionLang === 'vi'
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-muted border-border hover:bg-muted/80'
                      )}
                    >
                      Vietnamese
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">{t('studySession.questionLangDesc', 'Choose which side appears first on standard flashcards.')}</p>
                </div>

                {/* Voice Selector */}
                <div className="space-y-2">
                  <span className="text-sm flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    {t('studySession.voiceSelect', 'Pronunciation voice')}
                  </span>
                  <select
                    value={selectedVoiceURI}
                    onChange={(e) => handleVoiceChange(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <optgroup label="✨ Premium AI Voices (Highly Emotional)">
                      {PREMIUM_VOICES.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </optgroup>
                    {availableVoices.length > 0 && (
                      <optgroup label="💻 Standard Browser Voices">
                        {availableVoices.map((v) => (
                          <option key={v.voiceURI} value={v.voiceURI}>
                            {v.name} ({v.lang})
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  <button
                    onClick={() => speakText('Hello, how are you today?')}
                    className="text-xs text-green-500 hover:underline"
                  >
                    Play {t('studySession.testVoice', 'test voice')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(`/dashboard/study-sets/${studySetId}`)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('studySession.exit')}</span>
          </button>
          {!isSessionComplete && (
            <div className="flex items-center gap-3">
              {/* Manual speak button */}
              {currentCard && (
                <button
                  onClick={handleSpeakCurrentCard}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  title={t('studySession.pronounce', 'Pronounce')}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
              {/* Settings button */}
              <button
                onClick={() => setSettingsOpen((p) => !p)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  settingsOpen ? 'bg-green-500 text-white' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                )}
                title={t('studySession.settings', 'Study settings')}
              >
                <Settings2 className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium">
                {currentStudyIndex + 1} / {studyQueue.length}
              </span>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>

        {!isSessionComplete && currentCard && (
          <div className="mb-4 rounded-2xl border border-border/80 bg-card/75 p-2.5 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutoSpeakChange}
                  className={cn(
                    'inline-flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-semibold transition-all',
                    autoSpeak
                      ? 'bg-green-500 text-white shadow-sm shadow-green-500/20'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  Auto
                </button>

                <button
                  type="button"
                  onClick={handleToggleShuffle}
                  className={cn(
                    'inline-flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-semibold transition-all',
                    isShuffled
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Shuffle className="w-4 h-4" />
                  Shuffle
                </button>

                <button
                  type="button"
                  onClick={handleSpeakCurrentCard}
                  className="inline-flex h-9 items-center gap-2 rounded-xl bg-muted/60 px-3 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!isSpeechSupported()}
                >
                  <Volume2 className="w-4 h-4" />
                  Speak
                </button>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row lg:max-w-[520px] lg:justify-end">
                <div className="inline-flex h-9 rounded-xl bg-muted/60 p-1">
                  <button
                    type="button"
                    onClick={() => handleQuestionLangChange('en')}
                    className={cn(
                      'rounded-lg px-3 text-xs font-semibold transition-colors',
                      questionLang === 'en'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    EN first
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuestionLangChange('vi')}
                    className={cn(
                      'rounded-lg px-3 text-xs font-semibold transition-colors',
                      questionLang === 'vi'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    VI first
                  </button>
                </div>

                <select
                  value={selectedVoiceURI}
                  onChange={(e) => handleVoiceChange(e.target.value)}
                  className="h-9 min-w-0 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium text-foreground outline-none transition-shadow focus:ring-2 focus:ring-green-500/30 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
                  disabled={!isSpeechSupported()}
                  aria-label="Pronunciation voice"
                >
                  <optgroup label="✨ Premium AI Voices (Highly Emotional)">
                    {PREMIUM_VOICES.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </optgroup>
                  {availableVoices.length > 0 && (
                    <optgroup label="💻 Standard Browser Voices">
                      {availableVoices.map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {isSessionComplete ? (
            <SessionComplete
              key="complete"
              stats={sessionStats}
              studySetId={studySetId!}
              onRestart={handleRestart}
              xpEarned={sessionXp}
            />
          ) : currentCard ? (
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-between py-4"
            >
              {/* Card rendering - type-aware */}
              <div className="flex-1 flex items-center justify-center">
                {(() => {
                  const cardType = currentCard.type || (hasClozeMarkers(currentCard.front) ? 'cloze' : 'standard');

                  if (cardType === 'cloze') {
                    return (
                      <div className="w-full max-w-xl mx-auto">
                        <div className="bg-card border-2 border-border rounded-2xl p-6">
                          <span className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block text-center">{t('studySession.clozeCard')}</span>
                          <ClozeRenderer
                            text={currentCard.front}
                            onAllRevealed={() => setClozeRevealed(true)}
                          />
                          {currentCard.notes && clozeRevealed && (
                            <p className="text-xs text-muted-foreground mt-4 text-center">{currentCard.notes}</p>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (cardType === 'image_occlusion') {
                    try {
                      const data = JSON.parse(currentCard.front);
                      return (
                        <div className="w-full max-w-xl mx-auto">
                          <div className="bg-card border-2 border-border rounded-2xl p-4">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block text-center">{t('studySession.imageOcclusion')}</span>
                            <ImageOcclusionViewer
                              imageUrl={data.imageUrl}
                              regions={data.regions as OcclusionRegion[]}
                              onAllRevealed={() => setClozeRevealed(true)}
                            />
                          </div>
                        </div>
                      );
                    } catch {
                      // Fallback to standard card if JSON parsing fails
                    }
                  }

                  // Standard flip card respects the question side setting.
                  const display = getDisplayCard(currentCard);
                  return (
                    <FlipCard
                      front={display.front}
                      back={display.back}
                      notes={currentCard.notes}
                      isFlipped={isFlipped}
                      onFlip={flipCard}
                    />
                  );
                })()}
              </div>

              {/* Bottom controls */}
              <div className="space-y-4 pb-2">
                {/* Navigation */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={prevCard}
                    disabled={currentStudyIndex === 0}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border transition-all text-sm',
                      currentStudyIndex === 0
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:bg-muted'
                    )}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t('studySession.prev')}
                  </button>

                  <div className="flex items-center gap-1">
                    {studyQueue.slice(
                      Math.max(0, currentStudyIndex - 2),
                      Math.min(studyQueue.length, currentStudyIndex + 3)
                    ).map((_, idx) => {
                      const actualIdx = Math.max(0, currentStudyIndex - 2) + idx;
                      return (
                        <div
                          key={actualIdx}
                          className={cn(
                            'w-1.5 h-1.5 rounded-full transition-all',
                            actualIdx === currentStudyIndex
                              ? 'w-4 bg-green-500'
                              : actualIdx < currentStudyIndex
                              ? 'bg-green-500/40'
                              : 'bg-muted-foreground/30'
                          )}
                        />
                      );
                    })}
                  </div>

                  <button
                    onClick={nextCard}
                    disabled={currentStudyIndex >= studyQueue.length - 1}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border transition-all text-sm',
                      currentStudyIndex >= studyQueue.length - 1
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:bg-muted'
                    )}
                  >
                    {t('studySession.skip')}
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Rating buttons */}
                <div className="space-y-2">
                  <p className="text-center text-xs text-muted-foreground">
                    {(isFlipped || clozeRevealed) ? t('studySession.rateRecall') : t('studySession.tapCardThenRate')}
                  </p>
                  <div className="flex justify-center gap-1.5">
                    {qualityRatings.map((rating) => {
                      const bgColors: Record<number, string> = {
                        1: 'bg-red-500',
                        2: 'bg-orange-500',
                        3: 'bg-amber-500',
                        4: 'bg-green-500',
                        5: 'bg-emerald-500',
                      };
                      const canRate = isFlipped || clozeRevealed;
                      return (
                        <button
                          key={rating.quality}
                          onClick={() => handleRate(rating.quality)}
                          disabled={!canRate || isReviewing}
                          className={cn(
                            'flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all min-w-[60px]',
                            canRate
                              ? `${bgColors[rating.quality]} text-white shadow-md hover:scale-105`
                              : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed',
                            isReviewing && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          <rating.icon className="w-4 h-4" />
                          <span className="text-[10px] font-medium">{t(rating.labelKey)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
