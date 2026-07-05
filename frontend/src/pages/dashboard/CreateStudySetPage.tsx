import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudySetsStore } from '@/stores/useStudySetsStore';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import { ENDPOINTS } from '@/config/api';
import { FlashcardEditor, type FlashcardEditorRef } from './FlashcardEditor';
import type { CreateStudySetRequest } from '@/types';
import {
  ArrowLeft,
  X,
  Plus,
  Globe,
  Lock,
  Image,
  Loader2,
  Check,
  ChevronDown,
  Calendar,
  BookOpen,
  Upload,
} from 'lucide-react';

// =====================================================================
export function CreateStudySetPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoading: storeLoading, error } = useStudySetsStore();
  const editorRef = useRef<FlashcardEditorRef>(null);

  // ── Form state ─────────────────────────────────────────────────
  const [formData, setFormData] = useState<CreateStudySetRequest>({
    title: '',
    description: '',
    isPublic: false,
    tags: [],
    coverImageUrl: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // ── Bulk import modal state ──────────────────────────────────────
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [termSeparatorType, setTermSeparatorType] = useState<'tab' | 'comma' | 'custom'>('custom');
  const [customTermSeparator, setCustomTermSeparator] = useState('|');
  const [cardSeparatorType, setCardSeparatorType] = useState<'newline' | 'semicolon' | 'custom'>('newline');
  const [customCardSeparator, setCustomCardSeparator] = useState('\n');

  // Parser helper
  const parseImportText = useCallback((): Array<{ front: string; back: string }> => {
    if (!importText.trim()) return [];

    let cardSep: string | RegExp = /\r?\n|\r/;
    if (cardSeparatorType === 'semicolon') cardSep = ';';
    else if (cardSeparatorType === 'custom') cardSep = customCardSeparator || /\r?\n|\r/;

    let termSep = '\t';
    if (termSeparatorType === 'comma') termSep = ',';
    else if (termSeparatorType === 'tab') termSep = '\t';
    else if (termSeparatorType === 'custom') termSep = customTermSeparator || '\t';

    return importText
      .split(cardSep)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(termSep);
        return {
          front: (parts[0] || '').trim(),
          back: (parts[1] || '').trim(),
        };
      })
      .filter((c) => c.front);
  }, [importText, termSeparatorType, customTermSeparator, cardSeparatorType, customCardSeparator]);

  const previewCards = parseImportText();

  const handleImportSubmit = () => {
    const parsed = parseImportText();
    if (parsed.length > 0) {
      editorRef.current?.addCards(parsed);
    }
    setIsImportModalOpen(false);
    setImportText('');
  };

  // ── Card counts (from FlashcardEditor) ──────────────────────────
  const [cardCounts, setCardCounts] = useState({ total: 0, valid: 0 });

  // ── Save state ───────────────────────────────────────────────────
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | React.ReactNode | null>(null);

  // ── Tag handlers ─────────────────────────────────────────────────
  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      setTagInput('');
    }
  };
  const removeTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags?.filter((t) => t !== tag) }));
  };

  const handleCountChange = useCallback((total: number, valid: number) => {
    setCardCounts({ total, valid });
  }, []);

  // ── Save ─────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!formData.title.trim()) return;
    const validCards = editorRef.current?.getValidCards() || [];

    const handleLimitError = (err: any, fallbackMessage: string) => {
      if (err.response?.data?.message?.includes('free plan limit')) {
        setSaveError(
          <div className="flex flex-col gap-2 text-sm leading-relaxed">
            <p className="font-bold text-red-600 dark:text-red-400">Bạn đã đạt giới hạn tối đa của gói Miễn Phí.</p>
            <p>
              Nhập mã thử nghiệm <strong className="font-mono text-green-600 dark:text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">ILOVEENGLISH</strong> tại{' '}
              <a href="/dashboard/subscription" className="underline font-bold text-green-600 dark:text-green-400 hover:text-green-500 transition-colors">
                Trang Nâng Cấp Tài Khoản
              </a>{' '}
              để mở khóa gói PRO vĩnh viễn và tiếp tục học tập không giới hạn!
            </p>
          </div>
        );
      } else {
        setSaveError(fallbackMessage);
      }
    };

    if (validCards.length === 0) {
      try {
        const studySet = await api.post(ENDPOINTS.studySets.create, formData);
        navigate(`/dashboard/study-sets/${studySet.data.id}`);
      } catch (err: any) {
        handleLimitError(err, t('createStudySet.failedCreate'));
      }
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      const setRes = await api.post(ENDPOINTS.studySets.create, formData);
      const studySetId = setRes.data.id;
      await api.post(`/study-sets/${studySetId}/flashcards/bulk`, { flashcards: validCards });
      navigate(`/dashboard/study-sets/${studySetId}`);
    } catch (err: any) {
      handleLimitError(err, t('createStudySet.failedCreateRetry'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{t('createStudySet.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('createStudySet.subtitle')}</p>
          </div>
        </motion.div>

        {/* Error */}
        {(error || saveError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg p-4 mb-6"
          >
            {error || saveError}
          </motion.div>
        )}

        {/* ═══════════ Metadata ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border rounded-xl p-6 mb-6"
        >
          <div className="mb-4">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder={t('createStudySet.titlePlaceholder')}
              className="w-full text-xl font-semibold px-0 py-2 bg-transparent border-0 border-b-2 border-border focus:outline-none focus:border-green-500 placeholder:text-muted-foreground/50 transition-colors"
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder={t('createStudySet.descriptionPlaceholder')}
              rows={2}
              className="w-full px-0 py-1.5 text-sm bg-transparent border-0 border-b border-border/50 focus:outline-none focus:border-green-500/50 resize-none placeholder:text-muted-foreground/40 transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showMoreOptions ? 'rotate-180' : ''}`} />
            {showMoreOptions ? t('createStudySet.lessOptions') : t('createStudySet.moreOptions')}
          </button>

          <AnimatePresence>
            {showMoreOptions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-4 border-t border-border/50 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t('createStudySet.coverImageUrl')}</label>
                    <div className="relative">
                      <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="url"
                        value={formData.coverImageUrl || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, coverImageUrl: e.target.value }))}
                        placeholder={t('createStudySet.coverImagePlaceholder')}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t('createStudySet.tags')}</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                        placeholder={t('createStudySet.addTag')}
                        className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                      <Button type="button" variant="outline" size="sm" onClick={addTag} disabled={!tagInput.trim()}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {formData.tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="p-0.5 hover:bg-green-500/20 rounded-full">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Exam Date */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t('createStudySet.examDate')}</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="datetime-local"
                        value={formData.examDate || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, examDate: e.target.value || undefined }))}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{t('createStudySet.examDateHint')}</p>
                  </div>

                  {/* Exam Subject */}
                  {formData.examDate && (
                    <div>
                      <label className="block text-sm font-medium mb-1.5">{t('createStudySet.examSubject')}</label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={formData.examSubject || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, examSubject: e.target.value }))}
                          placeholder={t('createStudySet.examSubjectPlaceholder')}
                          className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t('createStudySet.visibility')}</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, isPublic: false }))}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${!formData.isPublic ? 'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400' : 'border-border hover:border-green-500/50'}`}
                      >
                        <Lock className="w-3.5 h-3.5" />{t('createStudySet.private')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, isPublic: true }))}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${formData.isPublic ? 'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400' : 'border-border hover:border-green-500/50'}`}
                      >
                        <Globe className="w-3.5 h-3.5" />{t('createStudySet.public')}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {formData.isPublic ? t('createStudySet.publicHint') : t('createStudySet.privateHint')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ═══════════ Flashcard Editor Header with Bulk Import ═══════════ */}
        <div className="flex items-center justify-between mb-4 mt-8">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-500" />
            Thẻ ghi nhớ
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
            className="border-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/10 hover:border-green-500/40"
          >
            <Upload className="w-4 h-4 mr-2" />
            Nhập hàng loạt (Word, Excel)
          </Button>
        </div>

        {/* ═══════════ Flashcard Editor ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FlashcardEditor ref={editorRef} onCountChange={handleCountChange} />
        </motion.div>

        {/* Bulk Import Modal */}
        <AnimatePresence>
          {isImportModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0b0f19] border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-slate-100"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold">Nhập dữ liệu</h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-normal">
                      Chép và dán dữ liệu ở đây (từ Word, Excel, Google Docs, vv)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsImportModalOpen(false); setImportText(''); }}
                    className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400 hover:text-slate-200" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Textarea */}
                  <div>
                    <textarea
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder={`Ví dụ (sử dụng dấu gạch đứng | để phân tách):\nnamed after | được đặt tên theo (phrasal verb) /neɪmd ˈɑːftər/\npopulous | đông dân (adjective) /ˈpɒpjələs/\ncontradiction | sự tương phản, mâu thuẫn (noun) /ˌkɒntrəˈdɪkʃn/`}
                      rows={8}
                      className="w-full px-4 py-3 bg-[#0d1321] border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm font-mono placeholder:text-slate-500 resize-y"
                    />
                  </div>

                  {/* Separators Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0f172a]/50 p-5 rounded-xl border border-slate-800">
                    {/* Between term and definition */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Giữa thuật ngữ và định nghĩa</h4>
                      <div className="flex flex-wrap items-center gap-4 text-sm font-normal">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="termSep"
                            checked={termSeparatorType === 'tab'}
                            onChange={() => setTermSeparatorType('tab')}
                            className="w-4 h-4 accent-green-500"
                          />
                          Tab
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="termSep"
                            checked={termSeparatorType === 'comma'}
                            onChange={() => setTermSeparatorType('comma')}
                            className="w-4 h-4 accent-green-500"
                          />
                          Phẩy
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="termSep"
                            checked={termSeparatorType === 'custom'}
                            onChange={() => setTermSeparatorType('custom')}
                            className="w-4 h-4 accent-green-500"
                          />
                          Tùy chỉnh
                        </label>
                        {termSeparatorType === 'custom' && (
                          <input
                            type="text"
                            value={customTermSeparator}
                            onChange={(e) => setCustomTermSeparator(e.target.value)}
                            maxLength={5}
                            className="w-16 px-2 py-1 bg-[#0b0f19] border border-slate-800 rounded text-center focus:outline-none focus:border-green-500 text-xs"
                          />
                        )}
                      </div>
                    </div>

                    {/* Between cards */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Giữa các thẻ</h4>
                      <div className="flex flex-wrap items-center gap-4 text-sm font-normal">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="cardSep"
                            checked={cardSeparatorType === 'newline'}
                            onChange={() => setCardSeparatorType('newline')}
                            className="w-4 h-4 accent-green-500"
                          />
                          Dòng mới
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="cardSep"
                            checked={cardSeparatorType === 'semicolon'}
                            onChange={() => setCardSeparatorType('semicolon')}
                            className="w-4 h-4 accent-green-500"
                          />
                          Chấm phẩy
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="cardSep"
                            checked={cardSeparatorType === 'custom'}
                            onChange={() => setCardSeparatorType('custom')}
                            className="w-4 h-4 accent-green-500"
                          />
                          Tùy chỉnh
                        </label>
                        {cardSeparatorType === 'custom' && (
                          <input
                            type="text"
                            value={customCardSeparator}
                            onChange={(e) => setCustomCardSeparator(e.target.value)}
                            maxLength={5}
                            className="w-16 px-2 py-1 bg-[#0b0f19] border border-slate-800 rounded text-center focus:outline-none focus:border-green-500 text-xs"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Live Preview */}
                  {previewCards.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-350">
                        Xem trước {previewCards.length} thẻ
                      </h4>
                      <div className="border border-slate-800 rounded-xl overflow-hidden max-h-[30vh] overflow-y-auto divide-y divide-slate-800 bg-[#070a13]">
                        {previewCards.map((card, i) => (
                          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 hover:bg-[#0d1321]/45 transition-colors">
                            <div className="flex gap-3">
                              <span className="text-xs text-slate-500 font-mono select-none mt-0.5">{i + 1}</span>
                              <div className="flex-1">
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Thuật ngữ</p>
                                <p className="text-sm font-medium text-slate-200">{card.front}</p>
                              </div>
                            </div>
                            <div className="pl-6 md:pl-0">
                              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Định nghĩa</p>
                              <p className="text-sm font-medium text-slate-300">{card.back || '—'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#0f172a]/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setIsImportModalOpen(false); setImportText(''); }}
                    className="border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  >
                    Hủy nhập
                  </Button>
                  <Button
                    type="button"
                    onClick={handleImportSubmit}
                    disabled={previewCards.length === 0}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium"
                  >
                    Nhập ({previewCards.length} thẻ)
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ═══════════ Sticky bottom bar ═══════════ */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
          <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => navigate(-1)}>
                {t('common.cancel')}
              </Button>
              {cardCounts.total > 0 && (
                <p className="text-sm text-muted-foreground hidden sm:block">
                  {t('createStudySet.cardsReady', { valid: cardCounts.valid, total: cardCounts.total })}
                  {cardCounts.total > cardCounts.valid && (
                    <span className="text-amber-500 ml-1">{t('createStudySet.incomplete', { count: cardCounts.total - cardCounts.valid })}</span>
                  )}
                </p>
              )}
            </div>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!formData.title.trim() || isSaving || storeLoading}
              className="bg-green-500 hover:bg-green-600 min-w-[140px] sm:min-w-[180px]"
            >
              {isSaving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('createStudySet.creating')}</>
              ) : (
                <><Check className="w-4 h-4 mr-2" />{cardCounts.valid > 0 ? t('createStudySet.createWithCount', { count: cardCounts.valid }) : t('createStudySet.createButton')}</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
