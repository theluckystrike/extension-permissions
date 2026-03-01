/**
 * Permission Explainer — Human-readable descriptions for Chrome permissions
 */
const EXPLANATIONS: Record<string, string> = {
    activeTab: 'Access the current tab when you click the extension icon',
    alarms: 'Schedule tasks to run at specific times',
    bookmarks: 'Read and modify your bookmarks',
    browsingData: 'Clear browsing data like history and cookies',
    clipboardRead: 'Read text from your clipboard',
    clipboardWrite: 'Copy text to your clipboard',
    contentSettings: 'Change browser content settings (JavaScript, images, cookies)',
    contextMenus: 'Add items to the right-click menu',
    cookies: 'Read and modify cookies on websites',
    debugger: 'Full debugging access to tabs (advanced)',
    declarativeContent: 'Show the extension icon based on page content',
    declarativeNetRequest: 'Block or modify network requests',
    desktopCapture: 'Capture screen content',
    downloads: 'Manage downloads — start, pause, search',
    gcm: 'Send and receive push messages',
    geolocation: 'Access your geographic location',
    history: 'Read and modify your browsing history',
    identity: 'Sign in with your Google account',
    idle: 'Detect when your computer is idle',
    management: 'Manage other extensions',
    nativeMessaging: 'Communicate with programs on your computer',
    notifications: 'Show desktop notifications',
    pageCapture: 'Save web pages as files',
    privacy: 'Read and change privacy settings',
    proxy: 'Manage proxy settings',
    scripting: 'Run code on web pages',
    sessions: 'Access recently closed tabs and sessions',
    sidePanel: 'Show a side panel in the browser',
    storage: 'Store extension data locally',
    system_cpu: 'Access CPU information',
    system_memory: 'Access memory information',
    tabCapture: 'Capture tab audio/video',
    tabGroups: 'Organize tabs into groups',
    tabs: 'See your open tabs (URLs and titles)',
    tts: 'Read text aloud (text-to-speech)',
    webNavigation: 'Observe and track page navigation',
    webRequest: 'Observe network requests',
};

export class PermissionExplainer {
    /** Get human-readable explanation for a permission */
    static explain(permission: string): string {
        return EXPLANATIONS[permission] || `Access to "${permission}" browser API`;
    }

    /** Get explanations for multiple permissions */
    static explainAll(permissions: string[]): Array<{ permission: string; explanation: string }> {
        return permissions.map((p) => ({ permission: p, explanation: this.explain(p) }));
    }

    /** Get risk level for a permission */
    static getRisk(permission: string): 'low' | 'medium' | 'high' {
        const high = ['debugger', 'pageCapture', 'tabCapture', 'desktopCapture', 'nativeMessaging', 'proxy', 'privacy'];
        const medium = ['cookies', 'history', 'bookmarks', 'tabs', 'browsingData', 'clipboardRead', 'geolocation', 'webRequest', 'management'];
        if (high.includes(permission)) return 'high';
        if (medium.includes(permission)) return 'medium';
        return 'low';
    }
}
