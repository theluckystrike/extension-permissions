/**
 * Host Permissions — MV3 host permission management
 */
export class HostPermissions {
    /** Check if host permission is granted for a URL */
    static async hasAccess(url: string): Promise<boolean> {
        try { return await chrome.permissions.contains({ origins: [new URL(url).origin + '/*'] }); }
        catch { return false; }
    }

    /** Request access to a specific origin */
    static async requestAccess(url: string): Promise<boolean> {
        const origin = new URL(url).origin + '/*';
        return chrome.permissions.request({ origins: [origin] });
    }

    /** Get all granted host permissions */
    static async getGrantedOrigins(): Promise<string[]> {
        const perms = await chrome.permissions.getAll();
        return perms.origins || [];
    }

    /** Revoke access to a host */
    static async revokeAccess(origin: string): Promise<boolean> {
        return chrome.permissions.remove({ origins: [origin] });
    }
}
