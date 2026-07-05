# Release Process

This document outlines the standard release process for the **Học cùng Royce** platform. We adhere strictly to Semantic Versioning (SemVer) and maintain an organized history of changes.

---

## 🏷️ Versioning Scheme (SemVer)

We format our releases using `MAJOR.MINOR.PATCH` numbers:
*   **MAJOR**: Breaking changes or large architectural re-designs.
*   **MINOR**: New features added in a backwards-compatible manner.
*   **PATCH**: Backwards-compatible bug fixes or security patches.

---

## 📅 Pre-release Checklist

Before declaring a new release:
1. **Lint and Type Checks**:
   - Backend: Run `npm run lint` and `npx tsc --noEmit`.
   - Frontend: Run `npm run lint` and `npm run build`.
2. **Docker Build Check**:
   - Ensure the entire composition runs locally:
     ```bash
     docker compose --env-file .env.docker up -d --build
     ```
3. **Changelog Update**:
   - Record the version, release date, and summaries of changes in `/CHANGELOG.md`.

---

## 🚀 Creating a Release

Follow these steps to package and tag a new release:

### 1. Update Version Numbers
Update the `"version"` field in:
- `/backend/package.json`
- `/frontend/package.json`

Commit these package edits:
```bash
git add backend/package.json frontend/package.json CHANGELOG.md
git commit -m "chore: bump version to v1.X.X"
```

### 2. Create a Git Tag
Create a lightweight or annotated Git tag matching the SemVer notation:
```bash
git tag -a v1.X.X -m "Release version 1.X.X"
```

### 3. Push to GitHub
Push the branch and the new tag to your remote repository:
```bash
git push origin main
git push origin v1.X.X
```

### 4. Draft a Release on GitHub
1. Navigate to your repository: `https://github.com/ROYCE-8425/quiz_study/releases`
2. Click **Draft a new release**.
3. Select the tag `v1.X.X`.
4. Copy the latest section of your `CHANGELOG.md` into the release description.
5. Click **Publish release**.

---

## 🛡️ Security Releases

For security fixes:
*   Avoid disclosing vulnerability details in the commit messages.
*   Tag and release immediately to patch production deployments.
*   Document the vulnerability fixed in `SECURITY.md` or contact maintainers directly at `trannhuy8425@gmail.com`.
