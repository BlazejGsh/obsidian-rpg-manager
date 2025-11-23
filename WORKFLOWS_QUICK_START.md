# Quick Start: Using GitHub Workflows

## 1️⃣ Push Changes to GitHub

```bash
cd c:\MyFiles\GIT_Repositories\obsidian-rpg-manager

# Stage the new workflow files
git add .github/workflows/
git add GITHUB_WORKFLOWS.md

# Commit
git commit -m "Add GitHub workflows for manual releases and builds"

# Push to repository
git push origin master
```

(Replace `master` with `main` if that's your default branch)

---

## 2️⃣ Verify Workflows are Active

1. Go to: https://github.com/BlazejGsh/obsidian-rpg-manager
2. Click on **Actions** tab
3. You should see:
   - ✅ **Create Release**
   - ✅ **Manual Build and Test**

---

## 3️⃣ Create Your First Release

### Method A: Via GitHub Web UI (Easiest)

1. Go to https://github.com/BlazejGsh/obsidian-rpg-manager/actions
2. Click **Create Release** workflow
3. Click **Run workflow** (blue button)
4. Enter:
   - **Release version**: `4.1.15`
   - **Git tag**: `4.1.15`
5. Click **Run workflow**
6. Wait ~2-5 minutes for completion
7. Check **Releases** page for the new release

### Method B: Via GitHub CLI (Advanced)

```bash
# If you have GitHub CLI installed
gh workflow run release.yml -f version=4.1.15 -f tag=4.1.15
```

---

## 4️⃣ After Release is Created

Your release will include:
- 📦 `main.js` - Compiled plugin
- 📋 `manifest.json` - Plugin metadata
- 📋 `manifest-beta.json` - Beta version metadata
- 🎨 `styles.css` - Plugin styles

Users can now:
- Download and install manually
- Use BRAT plugin manager
- Install from community registry

---

## 💡 Common Scenarios

### Scenario 1: Build and Test (No Release)

```
Actions → Manual Build and Test → Run workflow → Choose "build" or "test"
```

Use this to:
- Test changes before releasing
- Verify build succeeds
- Get build artifacts to test locally

---

### Scenario 2: Create a New Release

```
Actions → Create Release → Run workflow → Enter version info
```

Use this to:
- Release new features
- Publish bug fixes
- Update plugin for users

---

### Scenario 3: Release a Hotfix

```
Example: v4.1.14 → v4.1.15 (patch release)
Actions → Create Release → version: 4.1.15, tag: 4.1.15
```

---

## 🔍 Monitoring Workflow Execution

### While Running:
1. Go to **Actions** tab
2. Click the workflow that's running
3. See real-time logs
4. Watch build progress

### After Completion:
- ✅ Green checkmark = Success
- ❌ Red X = Failed
- Click on job to see detailed logs

---

## 🚨 Troubleshooting

### "Workflow not showing up"
- Push the `.github/workflows/` files first
- Wait a few moments for GitHub to recognize them
- Refresh the page

### "Build failed"
- Check the workflow logs
- Usually means `npm run build` had an error
- Fix the error locally first

### "Release not created"
- Check if version already exists
- Verify you can write to repository
- Check repository settings

---

## 📚 Advanced: Customize Workflows

Edit `.github/workflows/release.yml` to:
- Change Node.js version
- Add additional build steps
- Include more files in release
- Add automatic changelog generation
- Post to Discord/Slack on release

---

## Next Steps

1. ✅ Commit and push workflow files
2. ✅ Verify workflows appear in GitHub Actions
3. ✅ Create your first release
4. ✅ Share the release link with users
5. ✅ Enjoy automated releases! 🎉

---

For detailed documentation, see `GITHUB_WORKFLOWS.md`
