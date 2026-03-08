# extension-permissions

[![npm version](https://img.shields.io/npm/v/extension-permissions)](https://www.npmjs.com/package/extension-permissions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Last commit](https://img.shields.io/github/last-commit/theluckystrike/extension-permissions)](https://github.com/theluckystrike/extension-permissions/commits/main)

TypeScript library for Chrome extension permission management — check, request, explain, and monitor permissions. Built for Manifest V3 with smart optional permission flows and host permission helpers.

## Features

- **Check** — Query granted permissions, manifest permissions, and missing optional permissions
- **Request** — Request permissions with user-friendly error handling and sequential prompts
- **Explain** — Human-readable descriptions and risk levels for 35+ Chrome permissions
- **Monitor** — Watch for permission changes with callbacks
- **Host Permissions** — Manage origin/host permissions for Manifest V3
- **Optional Flows** — UI-friendly patterns for requesting permissions with context

## Installation

```bash
npm install extension-permissions
```

Requires `@types/chrome` as an optional peer dependency for full type support:

```bash
npm install -D @types/chrome
```

## Quick Start

```typescript
import {
  PermissionChecker,
  PermissionRequester,
  PermissionExplainer,
  OptionalPermissions,
  HostPermissions,
  PermissionMonitor,
} from 'extension-permissions';
```

## Usage Examples

### Checking Permissions

```typescript
// Check if specific permissions are granted
const hasTabs = await PermissionChecker.has(['tabs']);

// Check if specific origins are granted
const hasOrigin = await PermissionChecker.hasOrigins(['https://example.com/*']);

// Get all granted permissions
const all = await PermissionChecker.getAll();

// Get permissions listed in the manifest
const manifest = PermissionChecker.getManifestPermissions();

// Get optional permissions from the manifest
const optional = PermissionChecker.getOptionalPermissions();

// Find which optional permissions are not yet granted
const missing = await PermissionChecker.getMissing();

// Full summary of permission state
const summary = await PermissionChecker.getSummary();
// Returns { required, optional, granted, missing, origins }
```

### Requesting Permissions

```typescript
// Request permissions (returns structured result)
const result = await PermissionRequester.request(['tabs', 'storage']);
// { granted: true, permissions: ['tabs', 'storage'], deniedPermissions: [] }

// Request with origins
const result = await PermissionRequester.request(
  ['cookies'],
  ['https://api.example.com/*']
);

// Request permissions one at a time with callback after each
const { granted, denied } = await PermissionRequester.requestSequentially(
  ['tabs', 'bookmarks', 'storage'],
  (perm, wasGranted) => console.log(`${perm} ${wasGranted ? 'granted' : 'denied'}`)
);

// Revoke permissions
await PermissionRequester.revoke(['tabs']);
```

### Explaining Permissions

```typescript
// Get a plain-English explanation of a permission
PermissionExplainer.explain('tabs');
// "See your open tabs (URLs and titles)"

PermissionExplainer.explain('cookies');
// "Read and modify cookies on websites"

// Explain multiple permissions at once
const explanations = PermissionExplainer.explainAll(['tabs', 'cookies', 'storage']);
// [{ permission: 'tabs', explanation: '...' }, ...]

// Get risk level (low, medium, or high)
PermissionExplainer.getRisk('debugger');  // 'high'
PermissionExplainer.getRisk('cookies');   // 'medium'
PermissionExplainer.getRisk('storage');   // 'low'
```

### Managing Host Permissions

```typescript
// Check access to a specific URL
const canAccess = await HostPermissions.hasAccess('https://example.com/api/data');

// Request access to an origin
const granted = await HostPermissions.requestAccess('https://example.com/api/data');

// List all granted origins
const origins = await HostPermissions.getGrantedOrigins();

// Revoke access to an origin
await HostPermissions.revokeAccess('https://example.com/*');
```

### Monitoring Permission Changes

```typescript
const monitor = new PermissionMonitor();
await monitor.start();

// Subscribe to changes, returns an unsubscribe function
const unsubscribe = monitor.onChange((added, removed) => {
  console.log('Added permissions', added);
  console.log('Removed permissions', removed);
});

// Later, stop listening
unsubscribe();
```

### Optional Permission Flows

```typescript
// Request with a reason, plus onGranted/onDenied callbacks
await OptionalPermissions.requestWithReason({
  permissions: ['notifications'],
  reason: 'Send alerts when background tasks finish',
  onGranted: () => console.log('Permission granted!'),
  onDenied: () => console.log('User declined'),
});

// Request only on first use of a feature (stores state in chrome.storage.local)
const allowed = await OptionalPermissions.requestOnFirstUse(
  'export-feature',
  ['downloads'],
  ['https://cdn.example.com/*']
);
```

## API Reference

### PermissionChecker

Static methods for reading the current permission state.

| Method | Description |
|--------|-------------|
| `has(permissions: string[])` | Check if specific permissions are granted |
| `hasOrigins(origins: string[])` | Check if specific origins are granted |
| `getAll()` | Get all currently granted permissions |
| `getManifestPermissions()` | Get permissions listed in manifest |
| `getOptionalPermissions()` | Get optional permissions from manifest |
| `getMissing()` | Get optional permissions not yet granted |
| `getSummary()` | Get full summary of permission state |

### PermissionRequester

Request and revoke permissions with structured results.

| Method | Description |
|--------|-------------|
| `request(permissions, origins?)` | Request permissions, returns `RequestResult` |
| `requestSequentially(permissions, onEach?)` | Request one at a time with callbacks |
| `revoke(permissions, origins?)` | Revoke/remove permissions |

### PermissionExplainer

Human-readable descriptions and risk levels for Chrome permissions.

| Method | Description |
|--------|-------------|
| `explain(permission)` | Get plain-English explanation |
| `explainAll(permissions)` | Explain multiple permissions |
| `getRisk(permission)` | Get risk level: 'low', 'medium', or 'high' |

### OptionalPermissions

UI-oriented flows for requesting permissions with context.

| Method | Description |
|--------|-------------|
| `requestWithReason(options)` | Request with explanation and callbacks |
| `requestOnFirstUse(featureKey, permissions, origins?)` | Request only on first use |

### HostPermissions

Manage host/origin permissions for Manifest V3.

| Method | Description |
|--------|-------------|
| `hasAccess(url)` | Check if host permission is granted |
| `requestAccess(url)` | Request access to an origin |
| `getGrantedOrigins()` | Get all granted host permissions |
| `revokeAccess(origin)` | Revoke access to a host |

### PermissionMonitor

Watch for permission changes by polling.

| Method | Description |
|--------|-------------|
| `start()` | Start monitoring (polls every 5 seconds) |
| `onChange(callback)` | Subscribe to changes, returns unsubscribe function |

## Manifest Setup

List permissions you plan to request at runtime under `optional_permissions` in your `manifest.json`:

```json
{
  "manifest_version": 3,
  "permissions": ["storage"],
  "optional_permissions": [
    "tabs",
    "bookmarks",
    "notifications",
    "cookies",
    "activeTab"
  ],
  "optional_host_permissions": [
    "https://*.example.com/*"
  ]
}
```

## Project Structure

```
extension-permissions/
├── src/
│   ├── index.ts         # Main exports
│   ├── checker.ts      # PermissionChecker class
│   ├── requester.ts    # PermissionRequester class
│   ├── explainer.ts    # PermissionExplainer class
│   ├── optional.ts     # OptionalPermissions class
│   ├── host.ts         # HostPermissions class
│   └── monitor.ts      # PermissionMonitor class
├── package.json
├── tsconfig.json
├── LICENSE
└── README.md
```

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Lint
npm run lint
```

## Browser Support

- Chrome 90+
- Edge 90+
- Any Chromium-based browser supporting Manifest V3

## License

MIT. See [LICENSE](LICENSE) file.

---

Built at [zovo.one](https://zovo.one) by [theluckystrike](https://github.com/theluckystrike)
