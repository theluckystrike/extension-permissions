# extension-permissions

Manage optional Chrome extension permissions with user-friendly prompts.

## Overview

extension-permissions provides utilities to request optional permissions in a way that explains why each permission is needed, improving user trust and installation rates.

## Installation

```bash
npm install extension-permissions
```

## Usage

### Basic Permission Request

```javascript
import { PermissionManager } from 'extension-permissions';

const perms = new PermissionManager();

// Request a permission with explanation
await perms.request('tabs', {
  reason: 'We need access to tabs to show you relevant information',
});
```

### Multiple Permissions

```javascript
const perms = new PermissionManager();

const results = await perms.requestMany([
  { permission: 'tabs', reason: 'To display tab information' },
  { permission: 'storage', reason: 'To save your preferences' },
  { permission: 'bookmarks', reason: 'To help you manage bookmarks' },
]);

console.log(results);
// { tabs: true, storage: true, bookmarks: false }
```

### Checking Permissions

```javascript
const perms = new PermissionManager();

// Check if we have a permission
const hasTabs = await perms.has('tabs');

// Get all granted permissions
const granted = await perms.getGranted();
```

### With UI Prompts

```javascript
const perms = new PermissionManager({
  // Custom UI render function
  renderPrompt: (permissions, onAccept, onDecline) => {
    const modal = createPermissionModal(permissions);
    modal.onAccept = onAccept;
    modal.onDecline = onDecline;
    document.body.appendChild(modal);
  },
});

await perms.request('notifications', {
  reason: 'We need notifications to alert you about important updates',
  // Custom feature explanation
  feature: {
    title: 'Stay Notified',
    benefits: ['Get alerts when tasks complete', 'Never miss important updates'],
  },
});
```

## API

### PermissionManager Options

| Option | Type | Description |
|--------|------|-------------|
| renderPrompt | function | Custom prompt UI renderer |
| permissionStrings | object | Custom permission explanations |

### Methods

- `request(permission, options)` - Request single permission
- `requestMany(permissions)` - Request multiple permissions
- `has(permission)` - Check if permission is granted
- `getGranted()` - Get all granted permissions
- `remove(permission)` - Remove a permission

### Options for request()

| Option | Type | Description |
|--------|------|-------------|
| reason | string | Explanation for why permission is needed |
| feature | object | Additional feature context |
| required | boolean | If this is a required permission |

## Best Practices

### Request Permissions Contextually

```javascript
// ❌ Don't ask for all permissions at install
const perms = new PermissionManager();
await perms.requestMany([...allPermissions]);

// ✅ Ask when user needs the feature
document.getElementById('bookmark-btn').onclick = async () => {
  const hasPermission = await perms.has('bookmarks');
  if (!hasPermission) {
    await perms.request('bookmarks', {
      reason: 'Enable the bookmark feature to save your favorite pages',
    });
  }
  // ... use bookmarks API
};
```

### Explain Each Permission

```javascript
const permissionReasons = {
  tabs: 'To show you relevant information for each tab',
  bookmarks: 'To let you save and organize your favorite pages',
  notifications: 'To send you alerts when background tasks complete',
  storage: 'To remember your preferences between sessions',
  activeTab: 'To access the current page when you click the extension',
};
```

## Manifest Configuration

In `manifest.json`:

```json
{
  "permissions": [],
  "optional_permissions": [
    "tabs",
    "bookmarks", 
    "notifications",
    "storage",
    "activeTab"
  ]
}
```

## Browser Support

- Chrome 90+
- Edge 90+

## License

MIT
