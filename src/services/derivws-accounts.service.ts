const MONK_ACCOUNTS: DerivAccount[] = [
    {
        account_id: 'CRMONK001',
        account_type: 'real',
        balance: '5',
        currency: 'USD',
        group: 'mock',
        status: 'active',
    },
    {
        account_id: 'VRTCMONK001',
        account_type: 'demo',
        balance: '8039',
        currency: 'USD',
        group: 'mock',
        status: 'active',
    },
];

/**
 * Account information from derivatives/accounts endpoint
 */
export interface DerivAccount {
    account_id: string;
    balance: string;
    currency: string;
    group: string;
    status: string;
    account_type: 'demo' | 'real';
}

/**
 * Response from derivatives/accounts endpoint
 */
/**
 * Service for handling local Monk account operations and API URL retrieval
 *
 * This service manages:
 * - Fetching account list from derivatives/accounts endpoint
 * - Storing accounts in sessionStorage
 * - Fetching OTP and WebSocket URL for specific accounts
 * - Managing default account selection
 * - Singleton pattern to prevent duplicate API calls
 * - Promise caching to handle concurrent requests
 */
export class DerivWSAccountsService {
    // Singleton instance for promise caching
    private static accountsFetchPromise: Promise<DerivAccount[]> | null = null;
    private static otpFetchPromises: Map<string, Promise<string>> = new Map();

    /**
     * Clears all cached promises (useful for testing or forced refresh)
     */
    static clearCache(): void {
        this.accountsFetchPromise = null;
        this.otpFetchPromises.clear();
    }

    /**
     * Stores accounts list in sessionStorage
     * @param accounts Array of DerivAccount objects
     */
    static storeAccounts(accounts: DerivAccount[]): void {
        sessionStorage.setItem('deriv_accounts', JSON.stringify(accounts));
    }

    /**
     * Retrieves accounts list from sessionStorage
     * @returns Array of DerivAccount objects or null if not found
     */
    static getStoredAccounts(): DerivAccount[] | null {
        try {
            const accountsStr = sessionStorage.getItem('deriv_accounts');
            if (!accountsStr) {
                return null;
            }
            return JSON.parse(accountsStr) as DerivAccount[];
        } catch (error) {
            console.error('[MonkData] Error parsing stored accounts:', error);
            return null;
        }
    }

    /**
     * Gets the default account (first account from the list)
     * @returns DerivAccount object or null if no accounts available
     */
    static getDefaultAccount(): DerivAccount | null {
        const accounts = this.getStoredAccounts();
        if (!accounts || accounts.length === 0) {
            return null;
        }
        return accounts[0];
    }

    /**
     * Clears stored accounts from sessionStorage
     */
    static clearStoredAccounts(): void {
        sessionStorage.removeItem('deriv_accounts');
    }

    /**
     * Returns the local Monk account list.
     * @param accessToken Ignored; retained for compatibility with older callers.
     * @returns Promise with array of DerivAccount objects
     */
    static async fetchAccountsList(accessToken: string): Promise<DerivAccount[]> {
        const accounts = MONK_ACCOUNTS;
        this.storeAccounts(accounts);
        return accounts;
    }

    /**
     * Returns the local Monk API URL.
     * @param accessToken Ignored; retained for compatibility with older callers.
     * @param accountId Ignored; retained for compatibility with older callers.
     */
    static async fetchOTPWebSocketURL(accessToken: string, accountId: string): Promise<string> {
        return 'monk-data://local';
    }

    /**
     * Complete flow to get authenticated WebSocket URL with optimized caching
     * 1. Check if accounts are already in sessionStorage (skip fetch on refresh)
     * 2. If not in storage, fetch accounts list
     * 3. Store accounts in sessionStorage
     * 4. Get default account (first from list)
     * 5. Fetch OTP and WebSocket URL for that account (always fresh OTP)
     *
     * @param accessToken Bearer token from OAuth authentication
     * @returns Promise with WebSocket URL
     */
    static async getAuthenticatedWebSocketURL(accessToken: string): Promise<string> {
        try {
            let accounts: DerivAccount[] | null = null;

            // Step 1: Check if accounts are already stored (optimization for refresh)
            const storedAccounts = this.getStoredAccounts();
            if (storedAccounts && storedAccounts.length > 0) {
                accounts = storedAccounts;
            } else {
                // Step 2: Fetch accounts list if not in storage
                accounts = await this.fetchAccountsList(accessToken);

                if (!accounts || accounts.length === 0) {
                    throw new Error('No accounts available');
                }
            }

            // Step 3: Resolve which account to connect as.
            // On an account switch the caller has already written the new loginid to
            // localStorage before triggering a WebSocket regeneration, so we honour
            // that selection here instead of always falling back to accounts[0].
            const activeLoginId = localStorage.getItem('active_loginid');
            const targetAccount =
                (activeLoginId && accounts.find(a => a.account_id === activeLoginId)) || accounts[0];

            // Step 4: Fetch OTP and WebSocket URL for the resolved account (always fresh OTP)
            const websocketURL = await this.fetchOTPWebSocketURL(accessToken, targetAccount.account_id);
            return websocketURL;
        } catch (error) {
            console.error('[MonkData] Error in authenticated API URL flow:', error);
            throw error;
        }
    }
}
