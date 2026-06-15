# Chérie — Deploy to GitHub

Push the project to GitHub under the NoonTechStudio organization.

## Tasks

1. **Check current git status**
   - Run `git status` to see any uncommitted changes
   - Run `git log --oneline -5` to see recent commits

2. **Commit all pending changes**
   - Stage everything: `git add -a`
   - Commit: `git commit -m "feat: complete MVP — auth, payments, dashboard, appointments, clients, payments_log"`

3. **Create GitHub repo**
   - Repo name: `cherie`
   - Organization: `NoonTechStudio`
   - Visibility: **Private**
   - Do NOT initialize with README (project already has one)
   - Use GitHub CLI if available (`gh repo create NoonTechStudio/cherie --private`) or provide instructions to create manually at github.com

4. **Add remote and push**
   ```bash
   git remote add origin https://github.com/NoonTechStudio/cherie.git
   git branch -M main
   git push -u origin main
   ```

5. **Verify `.gitignore` is correct before pushing**
   Confirm these are gitignored (never pushed to GitHub):
   - `.env.local`
   - `.env`
   - `node_modules/`
   - `.next/`
   
   If any of these are NOT in `.gitignore`, add them before committing.

6. **Confirm success**
   - Show the GitHub repo URL
   - Confirm `.env.local` and `.env` are NOT visible in the pushed repo (check with `git ls-files | grep env`)

## Important
Do NOT push `.env.local` or `.env` to GitHub under any circumstances — these contain live Razorpay keys and Supabase service role key.
