# GitHub Workflows Guide

## Overview

This project includes automated GitHub Workflows for building and releasing the RPG Manager plugin.

## Available Workflows

### 1. Create Release (Manual Trigger)

**Filename:** `.github/workflows/release.yml`

**Purpose:** Build the plugin and create a GitHub Release with all necessary files.

**How to Use:**

1. Go to **GitHub Repository** → **Actions** tab
2. Select **"Create Release"** workflow on the left
3. Click **"Run workflow"** button
4. Fill in the inputs:
   - **Release version**: e.g., `4.1.15`
   - **Git tag**: e.g., `4.1.15`
5. Click **"Run workflow"**

**What it does:**
- Updates version in `manifest.json` and `manifest-beta.json`
- Updates `versions.json` with the new version
- Builds the plugin (`npm run build`)
- Creates a git tag
- Creates a GitHub Release with:
  - `main.js` (compiled plugin)
  - `manifest.json` (plugin metadata)
  - `manifest-beta.json` (beta metadata)
  - `styles.css` (plugin styles)

**Output:**
- New GitHub Release available at: `https://github.com/BlazejGsh/obsidian-rpg-manager/releases/tag/<tag>`
- These files can be used for:
  - Manual installation in Obsidian
  - BRAT plugin installation
  - Community plugin registry submission

---

### 2. Manual Build and Test

**Filename:** `.github/workflows/manual-build.yml`

**Purpose:** Run npm commands (build, test, dev) manually without creating a release.

**How to Use:**

1. Go to **GitHub Repository** → **Actions** tab
2. Select **"Manual Build and Test"** workflow
3. Click **"Run workflow"** button
4. Choose from the dropdown:
   - **build** - Compiles the plugin
   - **test** - Runs Jest tests
   - **dev** - Runs development mode
5. Click **"Run workflow"**

**Output:**
- Workflow logs show the execution
- If **build** is selected, artifacts are uploaded (available for 7 days):
  - `main.js`
  - `styles.css`
  - `manifest.json`

---

## Release Workflow Details

### Step-by-step breakdown:

1. **Checkout** - Retrieves the repository code
2. **Setup Node.js** - Installs Node.js 18 with npm caching
3. **Install dependencies** - Runs `npm install`
4. **Update manifest files** - Sets the version number
5. **Update versions.json** - Adds entry for new version
6. **Build plugin** - Runs `npm run build`
7. **Create git tag** - Tags the commit with the release version
8. **Create GitHub Release** - Creates a release with all built files
9. **Push updates** - Pushes the updated files to the repository

---

## Best Practices

✅ **Always test locally first:**
```bash
npm install
npm run build
npm test
```

✅ **Use semantic versioning:**
- Patch: `4.1.14` → `4.1.15` (bug fixes)
- Minor: `4.1.15` → `4.2.0` (new features)
- Major: `4.2.0` → `5.0.0` (breaking changes)

✅ **Keep version numbers consistent:**
- Both `version` and `tag` inputs should match
- Format: `MAJOR.MINOR.PATCH` (e.g., `4.1.15`)

✅ **Add release notes manually** (Optional):
- After workflow completes, edit the GitHub Release
- Add changelog details about what changed
- Add known issues or breaking changes

---

## Troubleshooting

### Workflow fails with "permission denied"

**Solution:** The repository needs proper permissions. Make sure:
- Repository is public OR
- Bot has write access to contents
- Check Settings → Actions → General → Workflow permissions

### Release not appearing

**Solution:** Check the Actions tab for workflow status:
1. Go to **Actions** tab
2. Click on the failed workflow
3. Scroll down to see error messages
4. Common issues:
   - Version already exists (use a new version number)
   - Build failed (check npm run build output)
   - Git push failed (check branch name)

### Want to edit a release?

1. Go to **Releases** page
2. Click on the release
3. Click **Edit**
4. Update description, add/remove files, etc.
5. Click **Update release**

---

## Integration with Obsidian

Once a release is created, users can install the plugin via:

### 1. Manual Installation
- Download files from release
- Place in `.obsidian/plugins/rpg-manager/`

### 2. BRAT Plugin Manager
- Paste repo URL in BRAT
- Plugin auto-updates from releases

### 3. Community Plugin Registry
- Submit manifest to registry
- Community gets automatic updates

---

## Environment Variables & Secrets

**No additional secrets needed!** The workflow uses the built-in `GITHUB_TOKEN` which is automatically provided by GitHub Actions.

---

## Questions or Issues?

Check the [GitHub Issues](https://github.com/BlazejGsh/obsidian-rpg-manager/issues) page or create a new issue.
