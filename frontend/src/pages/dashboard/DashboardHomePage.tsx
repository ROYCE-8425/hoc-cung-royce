import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStudySetsStore } from '@/stores/useStudySetsStore';
import { useGamificationStore } from '@/stores/useGamificationStore';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { XPProgressBar } from '@/components/XPProgressBar';
import { cn } from '@/lib/utils';
import {
  Plus,
  Library,
  BookOpen,
  Brain,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Target,
  Trophy,
  PlayCircle,
  FileQuestion,
  Zap,
  BarChart3,
  Calendar,
  Gamepad2,
  Globe,
  Search,
  Eye,
  Star,
} from 'lucide-react';
import type { StudySet } from '@/types';
import api from '@/services/api';
import { ENDPOINTS } from '@/config/api';

interface UserStats {
  studySetsCount: number;
  flashcardsCount: number;
  quizzesCompleted: number;
  streakDays: number;
}

interface DueCardsInfo {
  totalDue: number;
  studySets: { id: string; title: string; dueCount: number }[];
}

function getGreetingKey(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'dashboard.greeting.morning';
  if (hour < 17) return 'dashboard.greeting.afternoon';
  return 'dashboard.greeting.evening';
}

function QuickActionCard({
  icon: Icon,
  title,
  description,
  href,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  return (
    <Link
      to={href}
      className="bg-card border border-border rounded-xl p-5 hover:border-green-500/50 hover:shadow-lg transition-all group"
    >
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-semibold mb-1 group-hover:text-green-500 transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  color,
  delay = 0,
}: {
  icon: React.ElementType;
  value: number | string;
  label: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

function RecentStudySetCard({ studySet }: { studySet: StudySet }) {
  const { t } = useTranslation();
  return (
    <Link
      to={`/dashboard/study-sets/${studySet.id}`}
      className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-green-500/50 hover:shadow-md transition-all"
    >
      {studySet.coverImageUrl ? (
        <img
          src={studySet.coverImageUrl}
          alt={studySet.title}
          className="w-12 h-12 rounded-lg object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
          <Library className="w-6 h-6 text-green-500" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{studySet.title}</h4>
        <p className="text-sm text-muted-foreground">
          {studySet.flashcardsCount} {t('common.cards')}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground" />
    </Link>
  );
}

function ContinueStudyCard({ studySet, dueCount }: { studySet: StudySet; dueCount: number }) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
            <PlayCircle className="w-7 h-7 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t('dashboard.continueStudying')}</p>
            <h3 className="font-semibold text-lg">{studySet.title}</h3>
            <p className="text-sm text-green-600 dark:text-green-400">
              {t('dashboard.cardsDueForReview', { count: dueCount })}
            </p>
          </div>
        </div>
        <Button className="bg-green-500 hover:bg-green-600" asChild>
          <Link to={`/dashboard/study-sets/${studySet.id}/study`}>
            <Zap className="w-4 h-4 mr-2" />
            {t('dashboard.studyNow')}
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

export function DashboardHomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { studySets, isLoading, fetchStudySets } = useStudySetsStore();
  const { fetchGamification } = useGamificationStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [dueCards, setDueCards] = useState<DueCardsInfo | null>(null);
  const [lottieData, setLottieData] = useState<object | null>(null);

  // ── Community public study sets state ───────────────────────────
  const [publicSets, setPublicSets] = useState<StudySet[]>([]);
  const [publicSearch, setPublicSearch] = useState('');
  const [publicTab, setPublicTab] = useState<'popular' | 'newest'>('popular');
  const [isPublicLoading, setIsPublicLoading] = useState(false);

  const fetchPublicSets = async (searchStr = '') => {
    setIsPublicLoading(true);
    try {
      const response = await api.get(`/study-sets/public?limit=8${searchStr ? `&search=${encodeURIComponent(searchStr)}` : ''}`);
      setPublicSets(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch public study sets:', error);
    } finally {
      setIsPublicLoading(false);
    }
  };

  const getMockStats = (id: string) => {
    const charCodeSum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const views = (charCodeSum % 1800) + 120;
    const ratingRaw = ((charCodeSum % 15) / 10) + 3.5;
    const rating = Math.min(5.0, Math.round(ratingRaw * 10) / 10);
    return { views, rating };
  };

  const sortedPublicSets = [...publicSets].sort((a, b) => {
    if (publicTab === 'popular') {
      return getMockStats(b.id).views - getMockStats(a.id).views;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  useEffect(() => {
    fetchStudySets({ limit: 5 });
    fetchUserStats();
    fetchDueCards();
    fetchGamification();
    fetchPublicSets();
    // Fetch Lottie animation
    fetch('https://assets10.lottiefiles.com/packages/lf20_DMgKk1.json')
      .then(res => res.json())
      .then(setLottieData)
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchStudySets]);

  const fetchUserStats = async () => {
    try {
      const response = await api.get(ENDPOINTS.users.stats);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      // Fallback to calculated values
      setStats(null);
    }
  };

  const fetchDueCards = async () => {
    try {
      // Try to get due flashcards count
      const response = await api.get('/flashcards/due?limit=100');
      const flashcards = response.data.data || response.data || [];

      // Group by study set
      const studySetDueMap = new Map<string, { id: string; title: string; dueCount: number }>();
      for (const card of flashcards) {
        const existing = studySetDueMap.get(card.studySetId);
        if (existing) {
          existing.dueCount++;
        } else {
          studySetDueMap.set(card.studySetId, {
            id: card.studySetId,
            title: card.studySetTitle || 'Study Set',
            dueCount: 1,
          });
        }
      }

      setDueCards({
        totalDue: flashcards.length,
        studySets: Array.from(studySetDueMap.values()),
      });
    } catch (error) {
      console.error('Failed to fetch due cards:', error);
      setDueCards({ totalDue: 0, studySets: [] });
    }
  };

  const recentStudySets = studySets.slice(0, 5);
  const totalFlashcards = stats?.flashcardsCount ?? studySets.reduce((sum, set) => sum + set.flashcardsCount, 0);
  const studySetsCount = stats?.studySetsCount ?? studySets.length;
  const quizzesCompleted = stats?.quizzesCompleted ?? 0;
  const totalDue = dueCards?.totalDue ?? 0;

  // Find study set with most due cards for "Continue" section
  const continueStudySet = dueCards?.studySets?.[0];
  const matchingStudySet = continueStudySet
    ? studySets.find(s => s.id === continueStudySet.id)
    : null;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Welcome section with streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                {t('dashboard.welcome', { greeting: t(getGreetingKey()), name: user?.name?.split(' ')[0] || 'Learner' })} <motion.span
                  className="inline-block origin-[70%_70%]"
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' }}
                >👋</motion.span>
              </h1>
              <p className="text-muted-foreground">
                {totalDue > 0
                  ? t('dashboard.cardsWaiting', { count: totalDue })
                  : t('dashboard.readyToContinue')}
              </p>
            </div>
            {lottieData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="hidden sm:block flex-shrink-0"
              >
                <Lottie
                  animationData={lottieData}
                  loop
                  style={{ width: 100, height: 100 }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* XP Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6 bg-card border border-border rounded-xl p-4"
        >
          <XPProgressBar />
        </motion.div>

        {/* Continue where you left off */}
        {matchingStudySet && continueStudySet && continueStudySet.dueCount > 0 && (
          <div className="mb-6">
            <ContinueStudyCard
              studySet={matchingStudySet}
              dueCount={continueStudySet.dueCount}
            />
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Library}
            value={studySetsCount}
            label={t('dashboard.stats.studySets')}
            color="bg-green-500/10 text-green-500"
            delay={0.1}
          />
          <StatCard
            icon={BookOpen}
            value={totalFlashcards}
            label={t('dashboard.stats.flashcards')}
            color="bg-blue-500/10 text-blue-500"
            delay={0.15}
          />
          <StatCard
            icon={Target}
            value={totalDue}
            label={t('dashboard.stats.dueToday')}
            color="bg-amber-500/10 text-amber-500"
            delay={0.2}
          />
          <StatCard
            icon={FileQuestion}
            value={quizzesCompleted}
            label={t('dashboard.stats.quizzesDone')}
            color="bg-purple-500/10 text-purple-500"
            delay={0.25}
          />
        </div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold mb-4">{t('dashboard.quickActions.title')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              icon={Plus}
              title={t('dashboard.quickActions.newStudySet')}
              description={t('dashboard.quickActions.newStudySetDesc')}
              href="/dashboard/study-sets/create"
              color="bg-green-500/10 text-green-500"
            />
            <QuickActionCard
              icon={Brain}
              title={t('dashboard.quickActions.knowledgeBase')}
              description={t('dashboard.quickActions.knowledgeBaseDesc')}
              href="/dashboard/knowledge-base"
              color="bg-purple-500/10 text-purple-500"
            />
            <QuickActionCard
              icon={MessageSquare}
              title={t('dashboard.quickActions.aiChat')}
              description={t('dashboard.quickActions.aiChatDesc')}
              href="/dashboard/chat"
              color="bg-blue-500/10 text-blue-500"
            />
            <QuickActionCard
              icon={BarChart3}
              title={t('dashboard.quickActions.viewAnalytics')}
              description={t('dashboard.quickActions.viewAnalyticsDesc')}
              href="/dashboard/analytics"
              color="bg-amber-500/10 text-amber-500"
            />
            <QuickActionCard
              icon={Gamepad2}
              title={t('dashboard.quickActions.joinLiveQuiz')}
              description={t('dashboard.quickActions.joinLiveQuizDesc')}
              href="/dashboard/live-quiz"
              color="bg-pink-500/10 text-pink-500"
            />
          </div>
        </motion.div>

        {/* Recent study sets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t('dashboard.recentStudySets')}</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/study-sets">
                {t('common.viewAll')}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="w-6 h-6" />
            </div>
          ) : recentStudySets.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <Library className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('dashboard.noStudySetsYet')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('dashboard.createFirstStudySet')}
              </p>
              <Button className="bg-green-500 hover:bg-green-600" asChild>
                <Link to="/dashboard/study-sets/create">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('dashboard.createStudySet')}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentStudySets.map((studySet) => (
                <RecentStudySetCard key={studySet.id} studySet={studySet} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Community Public Study Sets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="mt-8 border-t border-border/60 pt-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-500" />
                Học phần nổi bật từ cộng đồng
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">Khám phá các học phần công khai được chia sẻ bởi cộng đồng người học</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Tabs */}
              <div className="flex bg-muted p-0.5 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setPublicTab('popular')}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                    publicTab === 'popular'
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Phổ biến nhất
                </button>
                <button
                  type="button"
                  onClick={() => setPublicTab('newest')}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                    publicTab === 'newest'
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Mới cập nhật
                </button>
              </div>

              {/* Search Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchPublicSets(publicSearch);
                }}
                className="relative flex items-center min-w-[200px]"
              >
                <input
                  type="text"
                  placeholder="Tìm kiếm học phần..."
                  value={publicSearch}
                  onChange={(e) => setPublicSearch(e.target.value)}
                  className="w-full text-xs bg-card border border-border rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500/30 text-foreground"
                />
                <Search className="absolute left-2.5 w-3.5 h-3.5 text-muted-foreground" />
              </form>
            </div>
          </div>

          {isPublicLoading ? (
            <div className="flex items-center justify-center py-16 bg-card border border-border rounded-xl">
              <Spinner className="w-6 h-6" />
            </div>
          ) : sortedPublicSets.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <p className="text-muted-foreground">Không tìm thấy học phần công khai nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedPublicSets.map((set) => {
                const stats = getMockStats(set.id);
                return (
                  <Link
                    key={set.id}
                    to={`/dashboard/study-sets/${set.id}`}
                    className="bg-card border border-border rounded-xl overflow-hidden hover:border-green-500/50 hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image/Header placeholder */}
                      <div className="relative h-28 bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                        {set.coverImageUrl ? (
                          <img
                            src={set.coverImageUrl}
                            alt={set.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <Library className="w-10 h-10 text-green-500/40" />
                        )}
                        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {set.flashcardsCount} thẻ
                        </span>
                      </div>

                      <div className="p-4">
                        <h4 className="font-bold text-sm line-clamp-1 group-hover:text-green-500 transition-colors mb-1">
                          {set.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px] mb-3">
                          {set.description || 'Không có mô tả cho học phần này.'}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground bg-muted/20">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {stats.views} lượt học
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {stats.rating}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Upcoming Exams */}
        {studySets.filter((s) => s.examDate && new Date(s.examDate) > new Date()).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              {t('dashboard.upcomingExams')}
            </h2>
            <div className="space-y-3">
              {studySets
                .filter((s) => s.examDate && new Date(s.examDate) > new Date())
                .sort((a, b) => new Date(a.examDate!).getTime() - new Date(b.examDate!).getTime())
                .slice(0, 3)
                .map((studySet) => {
                  const daysUntil = Math.ceil((new Date(studySet.examDate!).getTime() - Date.now()) / 86400000);
                  const colorClass = daysUntil > 14 ? 'text-green-500 bg-green-500/10' : daysUntil > 7 ? 'text-amber-500 bg-amber-500/10' : 'text-red-500 bg-red-500/10';
                  return (
                    <Link
                      key={studySet.id}
                      to={`/dashboard/study-sets/${studySet.id}`}
                      className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-green-500/50 transition-all"
                    >
                      <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{studySet.title}</h4>
                        <p className="text-sm text-muted-foreground">{studySet.examSubject || t('dashboard.exam')}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
                        {t('common.daysLeft', { count: daysUntil })}
                      </div>
                    </Link>
                  );
                })}
            </div>
          </motion.div>
        )}

        {/* Pro banner for free users */}
        {user?.plan === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{t('dashboard.upgradeBanner.title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.upgradeBanner.description')}
                  </p>
                </div>
              </div>
              <Button className="bg-green-500 hover:bg-green-600" asChild>
                <Link to="/pricing">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t('common.upgradeNow')}
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
