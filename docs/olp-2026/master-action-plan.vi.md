# Ke hoach tong the OLP PMNM 2026

Du an: **Hoc cung Royce / quiz_study**
Nhanh hien tai: `chore/olp-foss-readiness`
Ngay cap nhat: 2026-07-05
Muc tieu: dua du an tu ban fork Studyield thanh mot du an phan mem nguon mo co ho so FOSS sach, co cau chuyen DX-OS ro rang, co demo chay duoc, va co bang chung ky thuat thuyet phuc cho OLP PMNM 2026.

Tai lieu nay la **bang dieu khien chinh**. Khi lam tiep, uu tien theo thu tu P0 -> P1 -> P2 -> P3 -> P4. Moi viec xong phai ghi bang chung vao file nay hoac cac tai lieu lien quan.

---

## 1. Trang thai hien tai da xac minh

### Da hoan thanh

- [x] Da tao nhanh `chore/olp-foss-readiness`.
- [x] Da dong bo license package/backend/frontend ve `AGPL-3.0-only`, khop voi file `LICENSE`.
- [x] Da bo sung ghi cong upstream Studyield trong `README.md` va `NOTICE`.
- [x] Da them tai lieu OLP:
  - `docs/olp-2026/open-source-readiness-audit.vi.md`
  - `docs/olp-2026/pof-checklist.vi.md`
  - `docs/olp-2026/dx-os-architecture.vi.md`
  - `docs/olp-2026/showcase-script.vi.md`
- [x] Da them tai lieu phat trien:
  - `docs/development/build-from-source.md`
  - `docs/development/release-process.md`
- [x] Da them `.github/dependabot.yml`.
- [x] Da them logo that `frontend/public/logos/hoc-cung-royce-logo.png`.
- [x] Da sua `docker compose config` trong tai lieu thanh `docker compose --env-file .env.docker config --quiet` de khong in secret.
- [x] Da rotate Google OAuth secret, Gemini key, Grok key tren moi truong cuc bo.
- [x] Da xac minh `.env`, `backend/.env`, `frontend/.env`, `.env.bak` dang bi `.gitignore` chan.
- [x] Da build thanh cong backend bang `npm run build`.
- [x] Da build thanh cong frontend bang `npm run build`.
- [x] Da validate Docker Compose bang `docker compose --env-file .env.docker config --quiet`.
- [x] Da quet snapshot va git history bang pattern mo rong, khong thay secret that; chi con placeholder trong `.env.example` va `.env.docker`.

### Can than trong

- `backend/.env` cuc bo co secret that va khong bi git track. Khong bao gio in noi dung file nay vao report.
- Khong dung output day du cua `docker compose config` lam bang chung cong khai, vi no co the resolve `env_file` va in secret.
- `walkthrough.md` neu ton tai ngoai repo va co secret/log cau hinh thi khong duoc copy vao repo.
- Worktree hien rat rong: co ca FOSS docs, rebrand, product feature, infra/env, AI provider, subscription, UI import. Khong nen commit tat ca trong mot commit duy nhat.

---

## 2. Nguyen tac lam viec bat buoc

### Bao mat

- [ ] Khong commit bat ky file nao sau day:
  - `.env`
  - `.env.bak`
  - `backend/.env`
  - `frontend/.env`
  - Cloudflare tunnel config
  - Google credential JSON
  - file screenshot/log co key
- [ ] Khi can validate Docker Compose, chi dung:

```powershell
docker compose --env-file .env.docker config --quiet
```

- [ ] Khi can scan secret trong snapshot:

```powershell
git grep -n -E "GOCSPX-[0-9A-Za-z_-]+|xai-[0-9A-Za-z_-]+|sk-or-v1-[0-9A-Za-z_-]+|AIza[0-9A-Za-z_-]{20,}|OPENAI_API_KEY=sk-[0-9A-Za-z_-]+|OPENROUTER_API_KEY=sk-or-v1-[0-9A-Za-z_-]+|STRIPE_SECRET_KEY=sk_(live|test)_[0-9A-Za-z]+|whsec_[0-9A-Za-z]+|GOOGLE_CLIENT_SECRET=[^[:space:]]+" -- . ":!backend/package-lock.json" ":!frontend/package-lock.json"
```

- [ ] Neu scan thay match trong `.env.example`, `.env.docker` hoac comment mau thi review thu cong: placeholder chap nhan duoc, secret that thi dung ngay va khong in secret ra chat.
- [ ] Khong dung pattern qua rong nhu `AQ\.` trong scan snapshot vi de bat nham chuoi `FAQ...` trong locale. Neu can quet token dang `AQ...`, dung pattern dai hon nhu `AQ[0-9A-Za-z_-]{20,}` va review thu cong.

### Git hygiene

- [ ] Luon chay truoc khi sua:

```powershell
git status --short --branch
```

- [ ] Khong dung `git reset --hard`.
- [ ] Khong dung `git add .` cho dot nay. Phai stage theo nhom file.
- [ ] Moi commit can co y nghia rieng va co the review doc lap.

---

## 3. P0 - Viec phai xong truoc khi public/nop

### P0.1 Bat cau hinh GitHub repo

Ly do: OLP/PoF cham diem khong chi nhin code, ma nhin ca kha nang cong dong dong gop, bao loi, bao mat va release.

Can lam thu cong do 2FA:

- [x] Vao `https://github.com/ROYCE-8425/quiz_study/settings`.
- [x] `General > Features`: bat `Issues`.
- [x] `General > Features`: bat `Discussions`.
- [x] `Code security and analysis`: bat `Dependabot alerts`.
- [x] `Code security and analysis`: bat `Dependabot security updates`.
- [x] Kiem tra default branch la `main`.
- [ ] Neu CI on dinh, them branch protection cho `main`:
  - require pull request before merging
  - require status checks neu GitHub Actions da chay pass
  - khong bat rule qua chat lam khoa workflow cua chinh minh

Bang chung can ghi lai:

- Link repo settings khong can screenshot co thong tin rieng tu.
- Trang repo hien co tab Issues/Discussions.
- Dependabot alerts/security updates da bat.

### P0.2 Kiem tra secret lan cuoi

Ly do: secret da tung xuat hien trong walkthrough/log cuc bo. Da rotate, nhung can lap bang chung sach truoc public.

- [ ] Chay scan snapshot bang `git grep`.
- [ ] Chay scan history bang pattern mo rong, gom ca `AQ.` cua Gemini.
- [ ] Neu co the, cai va chay them Gitleaks:

```powershell
gitleaks detect --source . --no-banner --redact
```

Neu chua co Gitleaks, co the bo qua tam thoi nhung phai ghi ro: da quet pattern thu cong, chua chay Gitleaks.

Tieu chuan hoan thanh:

- Khong co secret that trong tracked files.
- Khong co secret that trong git history.
- Chi con placeholder trong `.env.example` hoac comment mau.

### P0.3 Tach commit dung nhom

Ly do: hien worktree co 80+ file thay doi. Neu commit mot lan, kho review va de nham giua thay doi FOSS voi thay doi san pham.

De xuat commit da chinh theo worktree hien tai:

1. `docs: establish OLP FOSS readiness materials`
   - `NOTICE`
   - `SECURITY.md`
   - `CONTRIBUTING.md`
   - `CODE_OF_CONDUCT.md`
   - `CHANGELOG.md`
   - `FUTURE_GOAL.md`
   - `docs/development/build-from-source.md`
   - `docs/development/release-process.md`
   - `docs/olp-2026/dx-os-architecture.vi.md`
   - `docs/olp-2026/master-action-plan.vi.md`
   - `docs/olp-2026/open-source-readiness-audit.vi.md`
   - `docs/olp-2026/pof-checklist.vi.md`
   - `docs/olp-2026/showcase-script.vi.md`
   - `backend/package.json`
   - `frontend/package.json`

2. `chore: rebrand project and public copy to Hoc cung Royce`
   - `README.md`
   - `README_AR.md`, `README_BN.md`, `README_DE.md`, `README_ES.md`, `README_FR.md`, `README_HI.md`
   - `README_JA.md`, `README_KO.md`, `README_PT-BR.md`, `README_RU.md`, `README_ZH.md`
   - `frontend/index.html`
   - `frontend/public/logos/hoc-cung-royce-logo.png`
   - `frontend/public/sitemap.xml`
   - `frontend/src/locales/*.json`
   - public/auth/legal/onboarding/tutorial pages neu chi la copy/link rebrand

3. `feat(backend): configure AI services and subscription upgrade flow`
   - `backend/src/main.ts`
   - `backend/src/health.controller.ts`
   - `backend/src/modules/ai/ai.service.ts`
   - `backend/src/modules/ai/embedding.service.ts`
   - `backend/src/modules/chat/chat.service.ts`
   - `backend/src/modules/email/email.service.ts`
   - `backend/src/modules/email/ses.service.ts`
   - `backend/src/modules/notifications/notifications.controller.ts`
   - `backend/src/modules/subscription/subscription.controller.ts`
   - `backend/src/modules/subscription/subscription.service.ts`

4. `test(backend): add health and subscription unit tests`
   - `backend/src/health.controller.spec.ts`
   - `backend/src/modules/subscription/subscription.controller.spec.ts`
   - `backend/src/modules/subscription/subscription.service.spec.ts`

5. `feat(frontend): add pro upgrade and study workflow updates`
   - `frontend/src/App.tsx`
   - `frontend/src/components/landing/FeaturesSection.tsx`
   - `frontend/src/components/landing/Footer.tsx`
   - `frontend/src/components/landing/Header.tsx`
   - `frontend/src/components/landing/HeroSection.tsx`
   - `frontend/src/components/notes/PresentationView.tsx`
   - `frontend/src/layouts/DashboardLayout.tsx`
   - `frontend/src/pages/dashboard/SubscriptionPage.tsx`
   - `frontend/src/pages/dashboard/AddFlashcardPage.tsx`
   - `frontend/src/pages/dashboard/CreateStudySetPage.tsx`
   - `frontend/src/pages/dashboard/DashboardHomePage.tsx`
   - `frontend/src/pages/dashboard/EditStudySetPage.tsx`
   - `frontend/src/pages/dashboard/FlashcardEditor.tsx`
   - `frontend/src/pages/dashboard/ImportSection.tsx`
   - `frontend/src/pages/dashboard/SettingsPage.tsx`
   - `frontend/src/pages/dashboard/StudySetDetailPage.tsx`
   - `frontend/src/pages/dashboard/index.ts`
   - `frontend/src/services/api.ts`
   - `frontend/src/utils/exportPdf.ts`

6. `chore(infra): update compose defaults and repository automation`
   - `.env.docker`
   - `.github/ISSUE_TEMPLATE/config.yml`
   - `.github/dependabot.yml`
   - `docker-compose.yml`
   - `frontend/.dockerignore`
   - `start.sh`

Neu muon lich su commit rat sach, dung `git add -p` cho cac file co the tron nhieu loai thay doi nhu `README.md`, `frontend/src/App.tsx`, `frontend/src/services/api.ts`. Neu uu tien toc do, co the stage theo file nhu danh sach tren va ghi ro trong PR la dot chuan hoa lon cho OLP preview.

Can kiem tra truoc khi commit:

```powershell
git diff --stat
git status --short
```

---

## 4. P1 - Sua nhung diem FOSS/PoF con yeu

### P1.1 Lam README trung thuc hon nua

Van de:

- README van con nhieu cau marketing tu upstream, co the hon muc voi repo ca nhan moi fork.
- Badge activity/contributor co the dung, nhung text can giam claim.

Can lam:

- [ ] Doi cac cau qua manh thanh cau co bang chung.
- [ ] Neu chua co docs domain, tiep tuc dung link GitHub file docs.
- [ ] Neu chua co coverage thuc, giu `coverage-planned`.
- [ ] Them mot muc ngan: "Project status for OLP preparation" de noi ro du an dang trong giai do chuan bi.

Tieu chuan hoan thanh:

- README khong claim "70% coverage" neu chua co report.
- README khong claim "24-48h PR review" neu chua co quy trinh that.
- README ghi ro upstream Studyield va fork status.

### P1.2 Them release dau tien

Ly do: PoF thich du an co phien ban/release ro rang, khong chi co source code.

Can lam:

- [ ] Chon version dau tien: `v0.1.0-olp-preview` hoac `v0.1.0`.
- [ ] Cap nhat `CHANGELOG.md` phan Unreleased thanh version cu the.
- [ ] Tao tag sau khi commit sach:

```powershell
git tag -a v0.1.0-olp-preview -m "OLP 2026 preview release"
git push origin v0.1.0-olp-preview
```

- [ ] Tao GitHub Release, noi ro:
  - license AGPL-3.0-only
  - build commands
  - Docker Compose validate command
  - known risks: test coverage thap, cloud API dependency, docs domain chua deploy

Tieu chuan hoan thanh:

- Co GitHub Release cong khai.
- Release notes khong chua secret, khong paste output `docker compose config` day du.

### P1.3 Them `SECURITY.md` chi tiet hon

Can lam:

- [ ] Ghi ro khong bao loi bao mat qua public issue.
- [ ] Them response expectation thuc te cho maintainer ca nhan, vi email ca nhan khong dam bao SLA doanh nghiep.
- [ ] Them muc "Secret handling":
  - `.env` khong commit
  - dung `.env.example`
  - dung `docker compose config --quiet`

---

## 5. P2 - Kiem thu va chat luong code

### P2.1 Backend unit test toi thieu

Muc tieu: co bang chung test that, khong chi build pass.

Uu tien test:

- [x] `SubscriptionService.upgradeToPro`
  - tao/upgrade subscription dung user
  - period 10 nam
  - khong crash neu user chua co subscription: da co fallback insert/upsert
- [x] `SubscriptionController.applyPromoCode`
  - code dung `ILOVEENGLISH`
  - code sai tra `BadRequestException`
  - can xac minh rieng guard auth o muc integration/e2e neu can cham chat hon
- [x] `HealthController`
  - root endpoint tra documentation `/api/v1/docs`
  - health degraded khi mot service fail
- [ ] `AiService`
  - lay base URL tu config
  - khong init client khi key la placeholder

Bang chung da verify ngay 2026-07-05:

- PASS `npm test -- --runInBand`: 3 suites pass, 14/14 tests pass.
- PASS `npm run build`: NestJS build thanh cong, khong co loi TypeScript.
- Da co test files: `health.controller.spec.ts`, `subscription.controller.spec.ts`, `subscription.service.spec.ts`.

Lenh verify:

```powershell
cd backend
npm test -- --runInBand
npm run build
```

Tieu chuan hoan thanh:

- It nhat 5-8 test backend pass. Da dat baseline hien tai: 14 tests pass.
- README/audit co the noi "initial automated tests added" thay vi "planned" neu co bang chung.

### P2.2 Frontend test/smoke test

Hien frontend chua thay test runner ro rang. Co 2 cach:

Phuong an nhe:

- [ ] Them Playwright smoke test cho cac route quan trong:
  - landing page
  - login page
  - dashboard redirect/protected route
  - create study set page neu co mock auth

Phuong an don gian hon:

- [ ] Viet manual QA checklist trong `docs/olp-2026/demo-qa-checklist.vi.md`.
- [ ] Ghi screenshots va expected states.

Tieu chuan hoan thanh:

- It nhat co mot checklist QA co the lap lai.
- Neu them Playwright thi CI chay duoc hoac co lenh local ro rang.

### P2.3 Fix warning bundle frontend

Hien build frontend pass nhung co warning:

- lottie-web dung `eval`
- chunk > 500 kB

Can lam:

- [ ] Ghi vao audit la warning khong chan build.
- [ ] Can nhac lazy-load cac page nang:
  - research
  - code sandbox
  - presentation/reveal
  - PDF export
  - dashboard pages it dung
- [ ] Neu khong kip, de vao roadmap sau OLP.

---

## 6. P3 - Demo OLP va DX-OS

### P3.1 Chuan bi demo data

Can co mot bo du lieu mau de BGK xem nhanh, khong phu thuoc tai khoan ca nhan.

- [ ] Tao folder `docs/olp-2026/demo-assets/` neu can.
- [ ] Tao mot file PDF/txt mau ngan ve tieng Anh hoac kien thuc hoc tap.
- [ ] Tao script/huong dan seed data:
  - tai khoan demo
  - study set demo
  - flashcards demo
  - quiz demo
- [ ] Neu khong seed bang code, viet checklist nhap tay trong `showcase-script.vi.md`.

Tieu chuan hoan thanh:

- Tu repo sach co the lap lai demo trong 15-20 phut.
- Demo khong can secret that neu chi show tinh nang offline/basic.

### P3.2 Kich ban demo 5-7 phut

Tai lieu hien co: `docs/olp-2026/showcase-script.vi.md`.

Can bo sung:

- [ ] Mot bang "neu AI API fail thi demo fallback nao".
- [ ] Mot bang "neu internet yeu thi demo local nao".
- [ ] Anh xa tung buoc demo sang H-P-D-I:
  - Human: nguoi hoc/tai khoan/dashboard
  - Process: upload/tai lieu -> flashcard/quiz -> study session
  - Data: database/vector/search/analytics
  - Intelligence: RAG/problem solver/teach-back

Tieu chuan hoan thanh:

- Doc script len trong 5-7 phut khong qua dai.
- Co backup plan khi API ngoai fail.

### P3.3 Slide thuyet trinh

- [ ] Tao `docs/olp-2026/presentation-outline.vi.md`.
- [ ] Gom 8-10 slide:
  1. Van de
  2. Giai phap
  3. DX-OS H-P-D-I
  4. Kien truc ky thuat
  5. Demo flow
  6. FOSS/PoF evidence
  7. Bao mat va license
  8. Roadmap cong dong
  9. Rủi ro va minh bach
  10. Ket luan

---

## 7. P4 - Nang cap ky thuat nen lam neu con thoi gian

### P4.1 Offline AI voi Ollama

Ly do: OLP co the cham trong moi truong khong muon phu thuoc cloud key.

Can lam:

- [ ] Them config:
  - `AI_PROVIDER=openrouter|openai|ollama`
  - `OLLAMA_BASE_URL=http://localhost:11434/v1`
  - `OLLAMA_MODEL=llama3.1`
- [ ] Sua `AiService` de co mode Ollama/OpenAI-compatible.
- [ ] Tai lieu hoa cach chay:

```powershell
ollama serve
ollama pull llama3.1
```

Tieu chuan hoan thanh:

- App co the generate response bang model local.
- Neu chua lam duoc, ghi trong roadmap, khong claim da hoan thanh.

### P4.2 Code sandbox an toan hon

Ly do: neu demo "cham bai/luyen code", sandbox la diem an tuong nhung cung nhay cam bao mat.

Can lam:

- [ ] Ghi ro hien trang sandbox hien tai.
- [ ] Neu co thoi gian, bo sung Docker isolated execution cho Python/Node.
- [ ] Them timeout, memory limit, network disabled neu co the.
- [ ] Viet tai lieu threat model ngan.

### P4.3 AI Audio Agent cho Teach-Back

Ly do: day la diem san pham hap dan cho "giao vien ao".

Can lam:

- [ ] Web Speech API hoac Web Audio API cho record voice.
- [ ] Speech-to-text provider hoac browser speech recognition.
- [ ] UI trong Teach-Back: record, stop, transcript, submit.
- [ ] Fallback text input khi browser khong ho tro.

Khong nen lam truoc P0-P2 neu thoi gian han che.

---

## 8. Rủi ro va cach giam tru

| Rủi ro | Muc do | Vi sao quan trong | Cach giam tru |
| --- | --- | --- | --- |
| Secret trong log cuc bo | Cao | Co the bi lo neu copy walkthrough/report | Khong commit walkthrough, rotate key, dung `config --quiet`, scan history |
| Worktree qua rong | Cao | Kho review, de commit nham | Tach commit theo nhom P0.3 |
| Test coverage thap | Trung binh/Cao | Build pass khong chung minh logic dung | Them backend unit tests toi thieu |
| Phu thuoc cloud AI | Trung binh | Demo co the fail neu key/mang loi | Co fallback demo va roadmap Ollama |
| Docs domain chua deploy | Trung binh | Link public co the chet | Dung GitHub blob link cho docs |
| README claim qua manh | Trung binh | BGK co the bat be bang chung | Giu van phong trung thuc, khong claim coverage/PR SLA |
| License/NOTICE bat nhat | Thap hien tai | Da sua AGPL | Kiem tra lai truoc release |
| Docker config in secret | Cao neu dung sai lenh | Output co the chua secret | Chi dung `config --quiet` |
| Mobile/upstream residue | Thap/Trung binh | Co the co duong dan/tai lieu cu | Neu khong demo mobile, ghi ngoai pham vi |

---

## 9. Lenh verify chuan truoc moi lan nop/commit

Chay tu root repo:

```powershell
git status --short --branch
git grep -n -E "GOCSPX-[0-9A-Za-z_-]+|xai-[0-9A-Za-z_-]+|sk-or-v1-[0-9A-Za-z_-]+|AIza[0-9A-Za-z_-]{20,}|OPENAI_API_KEY=sk-[0-9A-Za-z_-]+|OPENROUTER_API_KEY=sk-or-v1-[0-9A-Za-z_-]+|STRIPE_SECRET_KEY=sk_(live|test)_[0-9A-Za-z]+|whsec_[0-9A-Za-z]+|GOOGLE_CLIENT_SECRET=[^[:space:]]+" -- . ":!backend/package-lock.json" ":!frontend/package-lock.json"
docker compose --env-file .env.docker config --quiet
```

Backend:

```powershell
cd backend
npm run build
npm test
```

Frontend:

```powershell
cd frontend
npm run build
```

Neu `npm test` fail vi chua co test hoac test cu loi, ghi ro vao audit. Khong duoc ghi "test pass" neu chua chay.

---

## 10. Definition of Done cho OLP preview

Mot ban preview duoc xem la san sang khi:

- [ ] Repo public hoac san sang public, khong co secret tracked.
- [ ] GitHub Issues bat.
- [ ] GitHub Discussions bat hoac co ly do chua bat.
- [ ] Dependabot alerts/security updates bat.
- [ ] License, NOTICE, package metadata dong bo `AGPL-3.0-only`.
- [ ] README co link build docs dung.
- [ ] `build-from-source.md` chay dung voi script thuc te.
- [ ] `docker compose --env-file .env.docker config --quiet` pass.
- [x] Backend unit tests baseline pass: `npm test -- --runInBand` dat 3 suites, 14/14 tests.
- [x] `cd backend && npm run build` pass.
- [ ] `cd frontend && npm run build` pass.
- [ ] Co it nhat mot release/tag preview.
- [ ] Co demo script 5-7 phut.
- [ ] Co fallback demo khi cloud AI fail.
- [ ] Co ghi nhan trung thuc cac rui ro con lai.
- [ ] Commit duoc tach nhom ro rang, khong gom tat ca vao mot commit lon.

---

## 11. Goi y thu tu lam ngay tiep theo

1. Bat GitHub Issues, Discussions, Dependabot alerts/security updates.
2. Chay lai secret scan va build.
3. Tach commit FOSS docs truoc.
4. Tach commit rebrand.
5. Tach commit product feature.
6. Tao tag/release preview.
7. Chuan bi demo fallback khi cloud AI fail.
8. Hoan thien demo data va backup demo.
9. Tap thuyet trinh theo `showcase-script.vi.md`.
10. Neu con thoi gian, them Ollama fallback.

---

## 12. Prompt ngan cho Gemini khi giao tiep

Dung prompt nay neu can giao Gemini lam tiep tung phan:

```text
Hay doc `docs/olp-2026/master-action-plan.vi.md` va chi thuc hien mot muc uu tien duoc chi dinh. Khong sua ngoai pham vi. Khong commit `.env`. Khong dung `docker compose config` day du; chi dung `docker compose --env-file .env.docker config --quiet`. Truoc khi sua chay `git status --short --branch`. Sau khi sua bao cao file da doi, lenh verify da chay, va rui ro con lai. Khong in secret ra output.
```
