# extension-permissions

TypeScript library for managing Chrome extension permissions in Manifest V3. Check, request, explain, revoke, and monitor permissions with clean async APIs.

INSTALLATION

```bash
npm install extension-permissions
```

Requires @types/chrome as an optional peer dependency for full type support.

QUICK START

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

API

PermissionChecker

Static methods for reading the current permission state.

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

PermissionRequester

Request and revoke permissions with structured results.

```typescript
// Request permissions (returns RequestResult with granted, permissions, deniedPermissions)
const result = await PermissionRequester.request(['tabs', 'storage']);

// Request with origins
const result = await PermissionRequester.request(['cookies'], ['https://api.example.com/*']);

// Request permissions one at a time with a callback after each
const { granted, denied } = await PermissionRequester.requestSequentially(
  ['tabs', 'bookmarks', 'storage'],
  (perm, wasGranted) => console.log(`${perm} ${wasGranted ? 'granted' : 'denied'}`)
);

// Revoke permissions
await PermissionRequester.revoke(['tabs']);
```

The RequestResult type returned by request() looks like this.

```typescript
interface RequestResult {
  granted: boolean;
  permissions: string[];
  deniedPermissions: string[];
}
```

PermissionExplainer

Human-readable descriptions and risk levels for Chrome permissions.

```typescript
// Get a plain-English explanation of a permission
PermissionExplainer.explain('tabs');
// "See your open tabs (URLs and titles)"

// Explain multiple permissions at once
const explanations = PermissionExplainer.explainAll(['tabs', 'cookies', 'storage']);
// [{ permission: 'tabs', explanation: '...' }, ...]

// Get risk level (low, medium, or high)
PermissionExplainer.getRisk('debugger');  // 'high'
PermissionExplainer.getRisk('cookies');   // 'medium'
PermissionExplainer.getRisk('storage');   // 'low'
```

Covers 35+ Chrome permissions with built-in explanations. Unknown permissions get a sensible fallback string.

OptionalPermissions

UI-oriented flows for requesting permissions with context.

```typescript
// Request with a reason, plus onGranted/onDenied callbacks
await OptionalPermissions.requestWithReason({
  permissions: ['notifications'],
  reason: 'Send alerts when background tasks finish',
  onGranted: () => console.log('enabled'),
  onDenied: () => console.log('user declined'),
});

// Request only on first use of a feature (stores state in chrome.storage.local)
const allowed = await OptionalPermissions.requestOnFirstUse(
  'export-feature',
  ['downloads'],
  ['https://cdn.example.com/*']
);
```

The PermissionFlowOptions type accepted by requestWithReason() looks like this.

```typescript
interface PermissionFlowOptions {
  permissions: string[];
  origins?: string[];
  reason: string;
  onGranted?: () => void;
  onDenied?: () => void;
}
```

HostPermissions

Manage host/origin permissions for Manifest V3.

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

PermissionMonitor

Watch for permission changes by polling (Chrome has no native onChange event for permissions).

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

Polls every 5 seconds and fires callbacks only when the permission set actually changes.

MANIFEST SETUP

List permissions you plan to request at runtime under optional_permissions in your manifest.json.

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

DEVELOPMENT

```bash
npm install
npm run build
npm test
npm run lint
```

BROWSER SUPPORT

- Chrome 90+
- Edge 90+
- Any Chromium-based browser supporting Manifest V3

LICENSE

MIT. See LICENSE file.

ABOUT

Built by theluckystrike. Part of the Zovo project at zovo.one.
