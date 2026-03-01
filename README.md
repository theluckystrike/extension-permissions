# extension-permissions — Chrome Extension Permission Management

[![npm](https://img.shields.io/npm/v/extension-permissions.svg)](https://www.npmjs.com/package/extension-permissions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)]()

> **Built by [Zovo](https://zovo.one)** — managing permissions across 18+ Chrome extensions

**Complete permission lifecycle management** — check, request, explain, and monitor Chrome extension permissions. Smart optional permission flows and MV3 host permission helpers.

## 📦 Install

```bash
npm install extension-permissions
```

## 🚀 Usage

```typescript
import { PermissionChecker, PermissionRequester, PermissionExplainer, OptionalPermissions } from 'extension-permissions';

// Check what's granted
const summary = await PermissionChecker.getSummary();
// { required: [...], optional: [...], granted: [...], missing: [...] }

// Request with explanation
await OptionalPermissions.requestWithReason({
  permissions: ['tabs'],
  reason: 'Required to show your open tabs',
  onGranted: () => showTabList(),
});

// Human-readable explanations for 35+ permissions
PermissionExplainer.explain('cookies');
// → "Read and modify cookies on websites"

PermissionExplainer.getRisk('debugger'); // → 'high'
PermissionExplainer.getRisk('storage');  // → 'low'
```

## ✨ Features
- **Checker** — has, getAll, getMissing, getSummary
- **Requester** — request, requestSequentially, revoke
- **Explainer** — Human-readable explanations + risk levels for 35+ permissions
- **Optional** — Request-on-first-use, request-with-reason flows
- **Host Permissions** — MV3 per-origin access management
- **Monitor** — Watch for permission changes

## 📄 License
MIT — [Zovo](https://zovo.one)
