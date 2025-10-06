# Technical Upgrade: Migrate to pnpm Package Manager

**Branch**: `001-build-an-application` | **Date**: 2025-10-06  
**Type**: Technical Maintenance  
**Scope**: Update project to use pnpm instead of npm

## Summary

Migrate the existing Sales and Client Management System from npm to pnpm as the package manager. This change improves installation speed, reduces disk space usage, and provides better dependency management through pnpm's strict dependency resolution.

## Rationale for pnpm

**Benefits**:
- **Faster installations**: pnpm uses a content-addressable filesystem to store packages, avoiding duplicated files
- **Disk space efficient**: Single copy of each package version across all projects
- **Strict dependency resolution**: Prevents phantom dependencies and ensures correct dependency trees
- **Better monorepo support**: Native workspace support with isolated node_modules
- **NPM compatibility**: Works with existing package.json and npm scripts

**Migration Complexity**: Low - pnpm is designed to be a drop-in replacement for npm

## Changes Required

### 1. Package Manager Configuration
- Remove `package-lock.json` (npm's lock file)
- Generate `pnpm-lock.yaml` (pnpm's lock file)
- Add `.npmrc` or `pnpm-workspace.yaml` if needed for configuration

### 2. Documentation Updates
- Update README.md to reference pnpm commands
- Update quickstart.md installation instructions
- Update tasks.md if it contains npm commands
- Update any other documentation files with installation instructions

### 3. CI/CD Updates (if applicable)
- Update GitHub Actions workflows to use pnpm
- Update any deployment scripts
- Update Docker files if they reference npm

### 4. Script Compatibility
- Verify all package.json scripts work with pnpm
- No changes expected (pnpm uses same `run` command syntax)

### 5. Environment Setup
- Ensure pnpm is installed globally: `npm install -g pnpm`
- Or use Corepack (Node.js 16.13+): `corepack enable`

## Implementation Tasks

### Task 1: Install pnpm
```bash
# Option 1: Via npm (easiest for existing npm users)
npm install -g pnpm

# Option 2: Via Corepack (recommended for Node.js 16.13+)
corepack enable
corepack prepare pnpm@latest --activate
```

### Task 2: Remove npm artifacts
```bash
# Remove npm lock file
rm package-lock.json

# Remove node_modules (will be recreated by pnpm)
rm -rf node_modules
```

### Task 3: Install dependencies with pnpm
```bash
# Install all dependencies
pnpm install

# If needed, use --legacy-peer-deps equivalent
pnpm install --no-strict-peer-dependencies
```

### Task 4: Update Documentation

**Files to update**:
1. `README.md` - Change all `npm` commands to `pnpm`
2. `specs/001-build-an-application/quickstart.md` - Update installation steps
3. `specs/001-build-an-application/tasks.md` - Update any npm references
4. `.env.example` or setup docs - Update installation instructions

**Command Mapping**:
```
npm install        → pnpm install
npm install <pkg>  → pnpm add <pkg>
npm run <script>   → pnpm <script> (or pnpm run <script>)
npm test           → pnpm test
npx <command>      → pnpm exec <command> (or pnpm dlx <command>)
```

### Task 5: Update package.json (optional)
Add pnpm-specific configuration if needed:
```json
{
  "packageManager": "pnpm@8.0.0",
  "engines": {
    "pnpm": ">=8.0.0"
  }
}
```

### Task 6: Verify Installation
```bash
# Verify pnpm works
pnpm --version

# Verify dependencies installed correctly
pnpm list

# Verify scripts work
pnpm dev
pnpm build
pnpm test
```

### Task 7: Update .gitignore
Ensure pnpm-specific files are properly handled:
```
# Dependencies
node_modules/

# Lock files
package-lock.json  # npm (should not exist)
pnpm-lock.yaml     # pnpm (should be committed)

# pnpm store
.pnpm-store/
```

## Verification Checklist

- [ ] pnpm is installed and accessible
- [ ] `package-lock.json` removed
- [ ] `pnpm-lock.yaml` generated and committed
- [ ] All dependencies install successfully with `pnpm install`
- [ ] Development server starts with `pnpm dev`
- [ ] Build completes with `pnpm build`
- [ ] Tests run with `pnpm test`
- [ ] README.md updated with pnpm commands
- [ ] quickstart.md updated with pnpm installation steps
- [ ] All team members informed of the change

## Rollback Plan

If issues arise, revert to npm:
```bash
# Remove pnpm artifacts
rm pnpm-lock.yaml
rm -rf node_modules

# Reinstall with npm
npm install

# Restore documentation changes
git checkout HEAD -- README.md specs/001-build-an-application/quickstart.md
```

## Common Issues and Solutions

**Issue**: "ERR_PNPM_PEER_DEP_ISSUES"
- **Solution**: Use `pnpm install --no-strict-peer-dependencies` (equivalent to npm's `--legacy-peer-deps`)

**Issue**: Prisma commands not found
- **Solution**: Use `pnpm exec prisma` or `pnpm dlx prisma` instead of `npx prisma`

**Issue**: Different behavior with scripts
- **Solution**: pnpm runs scripts in isolated environments; ensure all dependencies are explicitly declared

## Timeline

- **Estimated Time**: 30-60 minutes
- **Risk Level**: Low (easy rollback)
- **Impact**: Team needs to install pnpm, update local workflows

## Success Criteria

- [ ] Project builds and runs successfully with pnpm
- [ ] All tests pass
- [ ] Documentation reflects pnpm usage
- [ ] Lock file is committed to git
- [ ] Team members can successfully set up the project with pnpm

---

**Status**: Ready for implementation  
**Next Step**: Execute Task 1-7 in sequence
