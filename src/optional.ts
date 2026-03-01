/**
 * Optional Permissions — UI flow for requesting permissions when needed
 */
export interface PermissionFlowOptions { permissions: string[]; origins?: string[]; reason: string; onGranted?: () => void; onDenied?: () => void; }

export class OptionalPermissions {
    /** Request with explanation — shows reason before asking */
    static async requestWithReason(options: PermissionFlowOptions): Promise<boolean> {
        const request: chrome.permissions.Permissions = { permissions: options.permissions };
        if (options.origins) request.origins = options.origins;

        // Check if already granted
        const already = await chrome.permissions.contains(request);
        if (already) { options.onGranted?.(); return true; }

        // Request
        const granted = await chrome.permissions.request(request);
        if (granted) { options.onGranted?.(); } else { options.onDenied?.(); }
        return granted;
    }

    /** Request permission only when a feature is first used */
    static async requestOnFirstUse(featureKey: string, permissions: string[], origins?: string[]): Promise<boolean> {
        const storageKey = `__perm_granted_${featureKey}`;
        const result = await chrome.storage.local.get(storageKey);
        if (result[storageKey]) return true;

        const request: chrome.permissions.Permissions = { permissions };
        if (origins) request.origins = origins;

        const already = await chrome.permissions.contains(request);
        if (already) { await chrome.storage.local.set({ [storageKey]: true }); return true; }

        const granted = await chrome.permissions.request(request);
        if (granted) { await chrome.storage.local.set({ [storageKey]: true }); }
        return granted;
    }
}
