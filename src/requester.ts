/**
 * Permission Requester — Smart request flows with retry
 */
export interface RequestResult { granted: boolean; permissions: string[]; deniedPermissions: string[]; }

export class PermissionRequester {
    /** Request permissions with user-friendly error handling */
    static async request(permissions: string[], origins?: string[]): Promise<RequestResult> {
        const request: chrome.permissions.Permissions = { permissions };
        if (origins) request.origins = origins;

        try {
            const granted = await chrome.permissions.request(request);
            if (granted) {
                return { granted: true, permissions, deniedPermissions: [] };
            }
            return { granted: false, permissions: [], deniedPermissions: permissions };
        } catch (error) {
            return { granted: false, permissions: [], deniedPermissions: permissions };
        }
    }

    /** Request permissions one at a time (for better UX — user sees what each permission does) */
    static async requestSequentially(
        permissions: string[],
        onEach?: (perm: string, granted: boolean) => void
    ): Promise<{ granted: string[]; denied: string[] }> {
        const granted: string[] = [];
        const denied: string[] = [];

        for (const perm of permissions) {
            const result = await this.request([perm]);
            if (result.granted) { granted.push(perm); }
            else { denied.push(perm); }
            onEach?.(perm, result.granted);
        }

        return { granted, denied };
    }

    /** Remove/revoke permissions */
    static async revoke(permissions: string[], origins?: string[]): Promise<boolean> {
        const request: chrome.permissions.Permissions = { permissions };
        if (origins) request.origins = origins;
        return chrome.permissions.remove(request);
    }
}
