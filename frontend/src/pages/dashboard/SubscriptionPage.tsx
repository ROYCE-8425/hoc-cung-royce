import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import { getApiErrorMessage } from '@/utils/apiError';
import {
  Crown,
  Check,
  X,
  Sparkles,
  Gift,
  ArrowLeft,
  Zap,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

export function SubscriptionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isAlreadyPro = user?.plan === 'pro' || user?.plan === 'team';

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await api.post('/subscription/promo-code', {
        code: promoCode.trim()
      });
      setSuccessMsg(response.data.message || 'Chúc mừng! Bạn đã nâng cấp lên PRO thành công!');
      setPromoCode('');
      await refreshUser();
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err) || 'Áp dụng mã thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto pb-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('common.back')}
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            Subscription plans
          </h1>
        </div>

        {/* Current status banner */}
        <div className="mb-8 p-4 rounded-xl bg-card border border-border flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Trạng thái tài khoản</p>
            <p className="text-lg font-bold mt-0.5">
              {isAlreadyPro ? (
                <span className="text-green-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5" />
                  Bạn đang sử dụng gói PRO (Vĩnh viễn/Trải nghiệm)
                </span>
              ) : (
                <span className="text-slate-400">Bạn đang sử dụng gói Miễn phí (Free Trial)</span>
              )}
            </p>
          </div>
          {isAlreadyPro && (
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-500 border border-green-500/20 uppercase">
              PRO Active
            </span>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Free Plan */}
          <div className="bg-card border border-border rounded-2xl p-6 relative flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-muted-foreground uppercase">Gói Miễn Phí</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">Free</span>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-extrabold">$0</span>
                <span className="text-muted-foreground text-sm"> / trọn đời</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Trải nghiệm học tập và ôn từ vựng cơ bản.</p>

              <ul className="space-y-3.5 mb-8">
                {[
                  { text: '100 Học phần (Study sets)', check: true },
                  { text: '1,000 Thẻ ghi nhớ (Flashcards)', check: true },
                  { text: '500 Yêu cầu hỗ trợ AI', check: true },
                  { text: '500 MB Dung lượng tải tệp', check: true },
                  { text: 'Chế độ thi thử & nhân bản đề thi', check: false },
                  { text: 'Công cụ AI Deep Research', check: false },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm">
                    {item.check ? (
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <span className={item.check ? 'text-foreground' : 'text-muted-foreground line-through'}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {!isAlreadyPro ? (
              <Button disabled variant="outline" className="w-full">
                Kế hoạch hiện tại của bạn
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">
                Quay lại trang chủ
              </Button>
            )}
          </div>

          {/* Pro Plan */}
          <div className="bg-card border-2 border-green-500 bg-gradient-to-b from-card to-green-500/5 rounded-2xl p-6 relative flex flex-col justify-between overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-bl-xl">
              Khuyên dùng
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-green-500 uppercase flex items-center gap-1">
                  <Sparkles className="w-4 h-4 fill-green-500" />
                  Gói PRO Vô Hạn
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">Pro</span>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-green-500">$9.99</span>
                <span className="text-muted-foreground text-sm"> / tháng (Miễn phí qua mã!)</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Mở khóa toàn bộ tính năng và học tập không giới hạn.</p>

              <ul className="space-y-3.5 mb-8">
                {[
                  { text: 'Không giới hạn học phần & thẻ ghi nhớ', check: true },
                  { text: 'Không giới hạn yêu cầu AI hỗ trợ học tập', check: true },
                  { text: '10 GB Dung lượng lưu trữ đám mây', check: true },
                  { text: 'Chế độ thi thử & Nhân bản đề thi nâng cao', check: true },
                  { text: 'Công cụ AI Deep Research thông minh', check: true },
                  { text: 'Giải bài tập hàng loạt và sơ đồ tư duy', check: true },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            {!isAlreadyPro ? (
              <Button onClick={() => {
                const el = document.getElementById('promo-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold">
                Nâng cấp miễn phí ngay
              </Button>
            ) : (
              <div className="text-center text-xs text-green-500 font-semibold py-2.5 border border-green-500/20 bg-green-500/5 rounded-lg flex items-center justify-center gap-1.5">
                <Zap className="w-4 h-4 fill-green-500" />
                Gói PRO đã được kích hoạt trên tài khoản của bạn!
              </div>
            )}
          </div>
        </div>

        {/* Promo Code section */}
        {!isAlreadyPro && (
          <motion.div
            id="promo-section"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-md relative"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Kích hoạt tài khoản PRO Thử nghiệm</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Nhập mã khuyến mại dưới đây để nâng cấp trực tiếp tài khoản của bạn lên gói PRO vĩnh viễn (hoàn toàn miễn phí).
                </p>
              </div>
            </div>

            {/* Promo guide badge */}
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-between">
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Mã kích hoạt dùng thử:</span>
              <span className="text-xs font-mono font-bold bg-green-500/20 text-green-600 dark:text-green-400 px-2.5 py-1 rounded border border-green-500/30">
                ILOVEENGLISH
              </span>
            </div>

            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập mã vào đây..."
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-[#0b0f19] border border-border/80 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500/30 text-slate-200"
              />
              <Button type="submit" disabled={isLoading} className="bg-green-500 hover:bg-green-600 text-white shrink-0">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Đang xử lý
                  </>
                ) : (
                  'Kích hoạt'
                )}
              </Button>
            </form>

            {successMsg && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-green-500 mt-3 font-semibold bg-green-500/5 p-2.5 rounded border border-green-500/20"
              >
                {successMsg}
              </motion.p>
            )}

            {errorMsg && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-500 mt-3 font-semibold bg-red-500/5 p-2.5 rounded border border-red-500/20"
              >
                {errorMsg}
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default SubscriptionPage;
