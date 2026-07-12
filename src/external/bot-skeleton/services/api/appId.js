import { createMonkDataAPI } from '@/services/monk-data-api';

/**
 * Singleton instance management for the local Monk data API
 */
let derivApiInstance = null;
let derivApiPromise = null;
let currentWebSocketURL = null;

/**
 * Clears the singleton instance (useful for logout or forced reconnection)
 */
export const clearDerivApiInstance = () => {
    if (derivApiInstance?.connection) {
        try {
            derivApiInstance.disconnect?.();
        } catch (error) {
            console.error('[MonkDataAPI] Error closing local API:', error);
        }
    }
    derivApiInstance = null;
    derivApiPromise = null;
    currentWebSocketURL = null;
};

/**
 * Generates a local API instance using the same interface the bot expects.
 * Prevents duplicate local sessions by reusing the existing instance.
 * @param {boolean} forceNew - Force creation of new instance (default: false)
 * @returns Promise with the local Monk data API instance
 */
export const generateDerivApiInstance = async (forceNew = false) => {
    // If forcing new instance, clear existing one
    if (forceNew) {
        console.log('[MonkDataAPI] Forcing new instance creation');
        clearDerivApiInstance();
    }

    // If there's already an instance, check its state
    if (derivApiInstance) {
        const readyState = derivApiInstance.connection?.readyState;
        // Return existing instance if it's connecting or open
        if (readyState === WebSocket.CONNECTING || readyState === WebSocket.OPEN) {
            console.log('[MonkDataAPI] Reusing existing instance (state:', readyState, ')');
            return derivApiInstance;
        } else {
            // Connection is closed or closing, clear it
            console.log('[MonkDataAPI] Existing instance not usable (state:', readyState, '), creating new');
            clearDerivApiInstance();
        }
    }

    // If there's already a creation in progress, return that promise
    if (derivApiPromise) {
        console.log('[MonkDataAPI] Reusing existing creation promise');
        return derivApiPromise;
    }

    // Create new instance
    derivApiPromise = (async () => {
        try {
            const deriv_api = createMonkDataAPI();

            // Store the instance immediately (don't wait for connection)
            derivApiInstance = deriv_api;
            currentWebSocketURL = 'monk-data://local';

            return deriv_api;
        } catch (error) {
            console.error('[MonkDataAPI] Error creating local API instance:', error);
            derivApiPromise = null;
            derivApiInstance = null;
            throw error;
        } finally {
            // Clear the promise after a short delay to allow reuse during concurrent calls
            setTimeout(() => {
                derivApiPromise = null;
            }, 100);
        }
    })();

    return derivApiPromise;
};

export const getLoginId = () => {
    const login_id = localStorage.getItem('active_loginid');
    if (login_id && login_id !== 'null') return login_id;
    return null;
};

export const V2GetActiveAccountId = () => {
    const account_id = localStorage.getItem('active_loginid');
    if (account_id && account_id !== 'null') return account_id;
    return null;
};

export const getToken = () => {
    const active_loginid = getLoginId();
    const client_accounts = JSON.parse(localStorage.getItem('accountsList')) ?? undefined;
    const active_account = (client_accounts && client_accounts[active_loginid]) || {};
    return {
        token: active_account ?? undefined,
        account_id: active_loginid ?? undefined,
    };
};
