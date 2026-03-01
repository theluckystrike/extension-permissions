/**
 * Permission Checker — Check which permissions are granted
 */
export class PermissionChecker {
    /** Check if specific permissions are granted */
    static async has(permissions: string[]): Promise<boolean> {
        return chrome.permissions.contains({ permissions });
    }

    /** Check if specific origins are granted */
    static async hasOrigins(origins: string[]): Promise<boolean> {
        return chrome.permissions.contains({ origins });
    }

    /** Get all currently granted permissions */
    static async getAll(): Promise<chrome.permissions.Permissions> {
        return chrome.permissions.getAll();
    }

    /** Get list of permissions from manifest */
    static getManifestPermissions(): string[] {
        const manifest = chrome.runtime.getManifest();
        return (manifest.permissions as string[]) || [];
    }

    /** Get optional permissions from manifest */
    static getOptionalPermissions(): string[] {
        const manifest = chrome.runtime.getManifest();
        return (manifest.optional_permissions as string[]) || [];
    }

    /** Check which optional permissions are not yet granted */
    static async getMissing(): Promise<string[]> {
        const optional = this.getOptionalPermissions();
        const granted = await this.getAll();
        const grantedPerms = granted.permissions || [];
        return optional.filter((p) => !grantedPerms.includes(p));
    }

    /** Get a summary of permission state */
    static async getSummary(): Promise<{
        required: string[];
        optional: string[];
        granted: string[];
        missing: string[];
        origins: string[];
    }> {
        const all = await this.getAll();
        const missing = await this.getMissing();
        return {
            required: this.getManifestPermissions(),
            optional: this.getOptionalPermissions(),
            granted: all.permissions || [],
            missing,
            origins: all.origins || [],
        };
    }
}
