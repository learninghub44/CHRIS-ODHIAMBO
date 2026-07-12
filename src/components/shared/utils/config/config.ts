import brandConfig from '../../../../../brand.config.json';
import { bootstrapMonkAccount } from '../../../../services/monk-data-api';

// =============================================================================
// Constants - Domain & Server Configuration (from brand.config.json)
// =============================================================================

// Production app domains
export const PRODUCTION_DOMAINS = {
    COM: brandConfig.platform.hostname.production.com,
} as const;

// Staging app domains
export const STAGING_DOMAINS = {
    COM: brandConfig.platform.hostname.staging.com,
} as const;

// WebSocket server URLs
export const WS_SERVERS = {
    STAGING: `${brandConfig.platform.derivws.url.staging}options/ws/public`,
    PRODUCTION: `${brandConfig.platform.derivws.url.production}options/ws/public`,
} as const;

// =============================================================================
// Helper Functions
// =============================================================================

// Helper to check if we're on production.
// NEXT_PUBLIC_DERIV_ENV is the authoritative signal (set at build/deploy time and
// also read by vendored deriv-core for OAuth), so a deployed partner domain resolves the
// same environment for WebSocket and OAuth. Falls back to hostname detection when
// the env var is unset (e.g. local dev).
export const isProduction = () => {
    const env = process.env.NEXT_PUBLIC_DERIV_ENV;
    if (env === 'production') return true;
    if (env === 'preview' || env === 'staging') return false;

    const hostname = window.location.hostname;
    const productionDomains = Object.values(PRODUCTION_DOMAINS) as string[];
    return productionDomains.includes(hostname);
};

export const isLocal = () => /localhost(:\d+)?$/i.test(window.location.hostname);

const getDefaultServerURL = () => {
    const isProductionEnv = isProduction();

    try {
        return isProductionEnv ? WS_SERVERS.PRODUCTION : WS_SERVERS.STAGING;
    } catch (error) {
        console.error('Error in getDefaultServerURL:', error);
    }

    return isProductionEnv ? WS_SERVERS.PRODUCTION : WS_SERVERS.STAGING;
};

/**
 * Gets the WebSocket URL using the authenticated flow
 * 1. Get access token from auth_info (localStorage via vendored deriv-core)
 * 2. Return the local Monk data transport URL
 *
 * @returns Promise with WebSocket URL or fallback to default server
 */
export const getSocketURL = async (): Promise<string> => {
    return 'monk-data://local';
};

export const getDebugServiceWorker = () => {
    const debug_service_worker_flag = window.localStorage.getItem('debug_service_worker');
    if (debug_service_worker_flag) return !!parseInt(debug_service_worker_flag);

    return false;
};

/**
 * Activates the local Monk login/session. Kept under the old name for compatibility.
 *
 * @param prompt - Optional prompt parameter ('registration' for sign-up flow)
 * @returns Empty string because no external redirect is needed
 */
export const generateOAuthURL = async (prompt?: string): Promise<string> => {
    bootstrapMonkAccount();
    return '';
};
