/**
 * Permission Monitor — Watch for permission changes with callbacks
 */
export class PermissionMonitor {
    private listeners: Array<(added: string[], removed: string[]) => void> = [];
    private previousPerms: string[] = [];

    /** Start monitoring permission changes */
    async start(): Promise<void> {
        const all = await chrome.permissions.getAll();
        this.previousPerms = all.permissions || [];

        // Poll every 5 seconds (chrome.permissions has no onChange event)
        setInterval(async () => {
            const current = await chrome.permissions.getAll();
            const currentPerms = current.permissions || [];
            const added = currentPerms.filter((p) => !this.previousPerms.includes(p));
            const removed = this.previousPerms.filter((p) => !currentPerms.includes(p));
            if (added.length > 0 || removed.length > 0) {
                this.listeners.forEach((cb) => cb(added, removed));
                this.previousPerms = currentPerms;
            }
        }, 5000);
    }

    /** Listen for permission changes */
    onChange(callback: (added: string[], removed: string[]) => void): () => void {
        this.listeners.push(callback);
        return () => { const idx = this.listeners.indexOf(callback); if (idx !== -1) this.listeners.splice(idx, 1); };
    }
}
