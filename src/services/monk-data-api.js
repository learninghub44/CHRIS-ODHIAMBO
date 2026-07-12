import {
    setAccountList,
    setAuthData,
    setConnectionStatus,
    setIsAuthorized,
    setIsAuthorizing,
    CONNECTION_STATUS,
} from '@/external/bot-skeleton/services/api/observables/connection-status-stream';
import { observer as globalObserver } from '@/external/bot-skeleton/utils/observer';

const MONK_ACCOUNTS = {
    CRMONK001: {
        account_type: 'real',
        balance: 5,
        country: 'US',
        currency: 'USD',
        is_virtual: 0,
        loginid: 'CRMONK001',
    },
    VRTCMONK001: {
        account_type: 'demo',
        balance: 8039,
        country: 'US',
        currency: 'USD',
        is_virtual: 1,
        loginid: 'VRTCMONK001',
    },
};

const DEFAULT_LOGINID = 'VRTCMONK001';

const getActiveLoginId = () => localStorage.getItem('active_loginid') || DEFAULT_LOGINID;

const getActiveAccount = () => MONK_ACCOUNTS[getActiveLoginId()] || MONK_ACCOUNTS[DEFAULT_LOGINID];

const updateAccountBalance = (loginid, nextBalance) => {
    const account = MONK_ACCOUNTS[loginid] || MONK_ACCOUNTS[DEFAULT_LOGINID];
    account.balance = Number(Number(nextBalance).toFixed(2));
    return account;
};

const getAccountList = () =>
    Object.values(MONK_ACCOUNTS).map(account => ({
        balance: account.balance,
        currency: account.currency,
        is_virtual: account.is_virtual,
        loginid: account.loginid,
    }));

const getStoredAccountList = () =>
    Object.values(MONK_ACCOUNTS).map(account => ({
        account_id: account.loginid,
        account_type: account.account_type,
        balance: String(account.balance),
        currency: account.currency,
        group: 'mock',
        status: 'active',
    }));

const ACTIVE_SYMBOLS = [
    {
        symbol: '1HZ100V',
        underlying_symbol: '1HZ100V',
        display_name: 'Volatility 100 (1s) Index',
        market: 'synthetic_index',
        market_display_name: 'Derived',
        submarket: 'random_index',
        submarket_display_name: 'Continuous Indices',
        exchange_is_open: 1,
        is_trading_suspended: 0,
        pip_size: 0.01,
        pip: 0.01,
        symbol_type: 'synthetic_index',
        underlying_symbol_type: 'synthetic_index',
    },
    {
        symbol: '1HZ10V',
        underlying_symbol: '1HZ10V',
        display_name: 'Volatility 10 (1s) Index',
        market: 'synthetic_index',
        market_display_name: 'Derived',
        submarket: 'random_index',
        submarket_display_name: 'Continuous Indices',
        exchange_is_open: 1,
        is_trading_suspended: 0,
        pip_size: 0.01,
        pip: 0.01,
        symbol_type: 'synthetic_index',
        underlying_symbol_type: 'synthetic_index',
    },
    {
        symbol: '1HZ25V',
        underlying_symbol: '1HZ25V',
        display_name: 'Volatility 25 (1s) Index',
        market: 'synthetic_index',
        market_display_name: 'Derived',
        submarket: 'random_index',
        submarket_display_name: 'Continuous Indices',
        exchange_is_open: 1,
        is_trading_suspended: 0,
        pip_size: 0.01,
        pip: 0.01,
        symbol_type: 'synthetic_index',
        underlying_symbol_type: 'synthetic_index',
    },
    {
        symbol: '1HZ50V',
        underlying_symbol: '1HZ50V',
        display_name: 'Volatility 50 (1s) Index',
        market: 'synthetic_index',
        market_display_name: 'Derived',
        submarket: 'random_index',
        submarket_display_name: 'Continuous Indices',
        exchange_is_open: 1,
        is_trading_suspended: 0,
        pip_size: 0.01,
        pip: 0.01,
        symbol_type: 'synthetic_index',
        underlying_symbol_type: 'synthetic_index',
    },
    {
        symbol: '1HZ75V',
        underlying_symbol: '1HZ75V',
        display_name: 'Volatility 75 (1s) Index',
        market: 'synthetic_index',
        market_display_name: 'Derived',
        submarket: 'random_index',
        submarket_display_name: 'Continuous Indices',
        exchange_is_open: 1,
        is_trading_suspended: 0,
        pip_size: 0.01,
        pip: 0.01,
        symbol_type: 'synthetic_index',
        underlying_symbol_type: 'synthetic_index',
    },
    {
        symbol: 'R_50',
        underlying_symbol: 'R_50',
        display_name: 'Volatility 50 Index',
        market: 'synthetic_index',
        market_display_name: 'Derived',
        submarket: 'random_index',
        submarket_display_name: 'Continuous Indices',
        exchange_is_open: 1,
        is_trading_suspended: 0,
        pip_size: 0.01,
        pip: 0.01,
        symbol_type: 'synthetic_index',
        underlying_symbol_type: 'synthetic_index',
    },
];

const CONTRACTS_FOR = [
    {
        barrier: '+0.1',
        barriers: 1,
        contract_category: 'callput',
        contract_type: 'CALL',
        expiry_type: 'tick',
        market: 'synthetic_index',
        max_contract_duration: '10t',
        min_contract_duration: '1t',
        submarket: 'random_index',
    },
    {
        barrier: '-0.1',
        barriers: 1,
        contract_category: 'callput',
        contract_type: 'PUT',
        expiry_type: 'tick',
        market: 'synthetic_index',
        max_contract_duration: '10t',
        min_contract_duration: '1t',
        submarket: 'random_index',
    },
    {
        contract_category: 'digits',
        contract_type: 'DIGITMATCH',
        expiry_type: 'tick',
        last_digit_range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        market: 'synthetic_index',
        max_contract_duration: '10t',
        min_contract_duration: '1t',
        submarket: 'random_index',
    },
    {
        contract_category: 'digits',
        contract_type: 'DIGITDIFF',
        expiry_type: 'tick',
        last_digit_range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        market: 'synthetic_index',
        max_contract_duration: '10t',
        min_contract_duration: '1t',
        submarket: 'random_index',
    },
    {
        contract_category: 'digits',
        contract_type: 'DIGITOVER',
        expiry_type: 'tick',
        last_digit_range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        market: 'synthetic_index',
        max_contract_duration: '10t',
        min_contract_duration: '1t',
        submarket: 'random_index',
    },
    {
        contract_category: 'digits',
        contract_type: 'DIGITUNDER',
        expiry_type: 'tick',
        last_digit_range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        market: 'synthetic_index',
        max_contract_duration: '10t',
        min_contract_duration: '1t',
        submarket: 'random_index',
    },
];

const makeSubscription = unsubscribe => ({ unsubscribe });

const now = () => Math.floor(Date.now() / 1000);

const getSymbolSeed = symbol =>
    String(symbol || '1HZ100V')
        .split('')
        .reduce((sum, char) => sum + char.charCodeAt(0), 0);

const getPrice = (symbol, offset = 0) => {
    const t = now() + offset;
    const seed = getSymbolSeed(symbol);
    const wave = Math.sin((t + seed) / 11) * 3 + Math.cos((t + seed) / 5) * 1.25;
    return Number((100 + (seed % 30) + wave).toFixed(2));
};

const makeHistory = (symbol, count = 1000) => {
    const end = now();
    const times = [];
    const prices = [];

    for (let i = count - 1; i >= 0; i--) {
        const epoch = end - i;
        times.push(epoch);
        prices.push(getPrice(symbol, -i));
    }

    return { prices, times };
};

const makeCandles = (symbol, count = 1000, granularity = 60) => {
    const end = now();
    return Array.from({ length: count }, (_, index) => {
        const open_time = end - (count - index) * granularity;
        const open = getPrice(symbol, index - count);
        const close = getPrice(symbol, index - count + 1);
        const high = Math.max(open, close) + 0.15;
        const low = Math.min(open, close) - 0.15;

        return {
            close: close.toFixed(2),
            high: high.toFixed(2),
            low: low.toFixed(2),
            open: open.toFixed(2),
            open_time,
        };
    });
};

export class MonkDataAPI {
    constructor() {
        this.listeners = new Map();
        this.messageSubscribers = new Set();
        this.subscriptions = new Map();
        this.nextSubscriptionId = 1;
        this.nextContractId = 100000;
        this.nextTransactionId = 500000;
        this.openContracts = new Map();
        this.proposals = new Map();
        this.connection = {
            readyState: WebSocket.OPEN,
            addEventListener: (event, callback) => {
                if (!this.listeners.has(event)) this.listeners.set(event, new Set());
                this.listeners.get(event).add(callback);
                if (event === 'open') setTimeout(callback, 0);
            },
            removeEventListener: (event, callback) => {
                this.listeners.get(event)?.delete(callback);
            },
        };
    }

    publish(data) {
        this.messageSubscribers.forEach(callback => callback({ data }));
    }

    publishBalance(account = getActiveAccount()) {
        const accountList = getAccountList();
        const response = {
            balance: { ...account },
            echo_req: { balance: 1, subscribe: 1 },
            msg_type: 'balance',
        };
        const clientStore = globalObserver.getState('client.store');

        setAccountList(accountList);
        setAuthData({
            ...account,
            account_list: accountList,
        });
        clientStore?.setAccountList?.(accountList);
        clientStore?.setLoginId?.(account.loginid);
        clientStore?.setBalance?.(String(account.balance));
        clientStore?.setCurrency?.(account.currency);
        clientStore?.setIsLoggedIn?.(true);
        this.publish(response);
        return response;
    }

    onMessage() {
        return {
            subscribe: callback => {
                this.messageSubscribers.add(callback);
                return makeSubscription(() => this.messageSubscribers.delete(callback));
            },
        };
    }

    disconnect() {
        this.connection.readyState = WebSocket.CLOSED;
        this.listeners.get('close')?.forEach(callback => callback());
        this.subscriptions.forEach(subscription => clearInterval(subscription.timer));
        this.subscriptions.clear();
    }

    authorize() {
        return this.balance().then(({ balance }) => ({ authorize: balance, error: null }));
    }

    balance() {
        const account = getActiveAccount();
        const response = {
            balance: { ...account },
            echo_req: { balance: 1 },
            msg_type: 'balance',
        };
        setTimeout(() => this.publish(response), 0);
        return Promise.resolve(response);
    }

    time() {
        return Promise.resolve({ echo_req: { time: 1 }, msg_type: 'time', time: now() });
    }

    forget(id) {
        const subscription = this.subscriptions.get(id);
        if (subscription) {
            clearInterval(subscription.timer);
            this.subscriptions.delete(id);
        }
        return Promise.resolve({ forget: id, msg_type: 'forget' });
    }

    forgetAll(type) {
        const forgetType = type === 'ticks' ? 'tick' : type === 'candles' ? 'ohlc' : type;
        this.subscriptions.forEach((subscription, id) => {
            if (!forgetType || subscription.msg_type === forgetType) {
                clearInterval(subscription.timer);
                this.subscriptions.delete(id);
            }
        });
        return Promise.resolve({ forget_all: type, msg_type: 'forget_all' });
    }

    send(request = {}) {
        if (request.ping) return Promise.resolve({ echo_req: request, msg_type: 'ping', ping: 'pong' });
        if (request.time) return this.time();
        if (request.balance) return this.handleBalanceRequest(request);
        if (request.active_symbols) return Promise.resolve({ active_symbols: ACTIVE_SYMBOLS, echo_req: request, msg_type: 'active_symbols' });
        if (request.trading_times) return Promise.resolve(this.getTradingTimes(request));
        if (request.contracts_for) return Promise.resolve({ contracts_for: { available: CONTRACTS_FOR }, echo_req: request, msg_type: 'contracts_for' });
        if (request.ticks_history) return this.handleTicksHistory(request);
        if (request.proposal) return this.handleProposal(request);
        if (request.buy) return this.handleBuy(request);
        if (request.sell) return this.handleSell(request);
        if (request.proposal_open_contract) return this.handleProposalOpenContract(request);
        if (request.transaction) return this.handleTransactionSubscription(request);
        if (request.forget) return this.forget(request.forget);
        if (request.forget_all) return this.forgetAll(request.forget_all);

        return Promise.resolve({ echo_req: request, msg_type: 'unknown' });
    }

    handleBalanceRequest(request) {
        if (request.subscribe) {
            const id = this.addIntervalSubscription('balance', () => ({
                balance: { ...getActiveAccount() },
                echo_req: request,
                msg_type: 'balance',
            }), 5000);
            return Promise.resolve({ balance: { ...getActiveAccount() }, echo_req: request, msg_type: 'balance', subscription: { id } });
        }
        return this.balance();
    }

    handleTransactionSubscription(request) {
        const id = this.addIntervalSubscription('transaction', () => ({
            echo_req: request,
            msg_type: 'transaction',
            transaction: { action: 'noop', amount: 0, balance: getActiveAccount().balance, currency: getActiveAccount().currency },
        }), 60000);
        return Promise.resolve({ echo_req: request, msg_type: 'transaction', subscription: { id } });
    }

    handleTicksHistory(request) {
        const symbol = request.ticks_history;
        const count = Math.min(Number(request.count || 1000), 1000);
        const style = request.style || (request.granularity ? 'candles' : 'ticks');
        const response =
            style === 'candles'
                ? { candles: makeCandles(symbol, count, Number(request.granularity || 60)), echo_req: request, msg_type: 'candles' }
                : { history: makeHistory(symbol, count), echo_req: request, msg_type: 'history' };

        if (request.subscribe) {
            const msgType = style === 'candles' ? 'ohlc' : 'tick';
            const id = this.addIntervalSubscription(msgType, () => {
                if (style === 'candles') {
                    const price = getPrice(symbol);
                    return {
                        echo_req: request,
                        msg_type: 'ohlc',
                        ohlc: {
                            close: price.toFixed(2),
                            epoch: now(),
                            granularity: Number(request.granularity || 60),
                            high: (price + 0.2).toFixed(2),
                            id,
                            low: (price - 0.2).toFixed(2),
                            open: (price - 0.05).toFixed(2),
                            open_time: now(),
                            symbol,
                        },
                    };
                }
                return {
                    echo_req: request,
                    msg_type: 'tick',
                    tick: { epoch: now(), id, quote: getPrice(symbol), symbol },
                };
            }, style === 'candles' ? 3000 : 1000);
            response.subscription = { id };
        }

        return Promise.resolve(response);
    }

    handleProposal(request) {
        const id = `proposal-${this.nextSubscriptionId++}`;
        const ask_price = Number(request.amount || 1);
        const payout = this.getPayoutForContract(request.contract_type, ask_price);
        const proposal = {
            ask_price,
            contract_type: request.contract_type || 'CALL',
            display_value: ask_price.toFixed(2),
            id,
            payout,
            spot: getPrice(request.underlying_symbol),
            spot_time: now(),
        };
        this.proposals.set(id, { proposal, request });
        const response = {
            echo_req: request,
            msg_type: 'proposal',
            passthrough: request.passthrough,
            proposal,
        };

        if (request.subscribe) {
            response.subscription = { id };
            this.subscriptions.set(id, { msg_type: 'proposal', timer: null });
        }

        setTimeout(() => this.publish(response), 0);
        return Promise.resolve(response);
    }

    handleBuy(request) {
        const contract_id = this.nextContractId++;
        const transaction_id = this.nextTransactionId++;
        const storedProposal = this.proposals.get(request.buy);
        const proposalRequest = storedProposal?.request || {};
        const parameters = request.parameters || proposalRequest;
        const buy_price = Number(request.price || parameters.amount || storedProposal?.proposal?.ask_price || 1);
        const contract_type = parameters.contract_type || storedProposal?.proposal?.contract_type || 'CALL';
        const symbol = parameters.underlying_symbol || '1HZ100V';
        const account = getActiveAccount();
        const balance_after_buy = Number((account.balance - buy_price).toFixed(2));
        updateAccountBalance(account.loginid, balance_after_buy);
        const prediction = parameters.selected_tick ?? parameters.barrier ?? 0;
        const payout = this.getPayoutForContract(contract_type, buy_price);
        const profit = Number((payout - buy_price).toFixed(2));
        const entry_tick = getPrice(symbol);
        const exit_tick = this.getWinningExitTick(contract_type, entry_tick, prediction);
        const contract = {
            bid_price: buy_price,
            buy_price,
            contract_id,
            contract_type,
            currency: account.currency,
            date_start: now(),
            display_name: ACTIVE_SYMBOLS.find(active_symbol => active_symbol.symbol === symbol)?.display_name || symbol,
            entry_tick,
            entry_spot: entry_tick,
            entry_tick_time: now(),
            id: contract_id,
            is_expired: 0,
            is_sold: 0,
            is_valid_to_sell: 1,
            longcode: `Monk data ${contract_type} contract`,
            payout,
            profit: 0,
            sell_price: 0,
            shortcode: `${contract_type}_${symbol}`,
            status: 'open',
            transaction_ids: { buy: transaction_id },
            underlying: symbol,
            underlying_symbol: symbol,
        };
        this.openContracts.set(contract_id, contract);

        const response = {
            buy: {
                balance_after: balance_after_buy,
                buy_price,
                contract_id,
                longcode: `Monk data ${contract_type} contract`,
                payout,
                purchase_time: now(),
                shortcode: `${contract_type}_${symbol}`,
                start_time: now(),
                transaction_id,
            },
            echo_req: request,
            msg_type: 'buy',
        };

        setTimeout(() => {
            this.publish(response);
            this.publish({
                msg_type: 'transaction',
                transaction: {
                    action: 'buy',
                    amount: buy_price,
                    balance: balance_after_buy,
                    contract_id,
                    currency: account.currency,
                    transaction_id,
                },
            });
            this.publishBalance({ ...account, balance: balance_after_buy });
            this.publish({ msg_type: 'proposal_open_contract', proposal_open_contract: contract });
        }, 0);

        setTimeout(() => {
            const latestContract = this.openContracts.get(contract_id);
            if (!latestContract || latestContract.is_sold) return;

            const sellTransactionId = this.nextTransactionId++;
            const latestAccount = getActiveAccount();
            const balance_after_sell = updateAccountBalance(latestAccount.loginid, latestAccount.balance + payout).balance;
            const soldContract = {
                ...latestContract,
                bid_price: payout,
                date_expiry: now(),
                exit_tick,
                exit_spot: exit_tick,
                exit_tick_time: now(),
                is_expired: 1,
                is_sold: 1,
                is_valid_to_sell: 0,
                profit,
                sell_price: payout,
                status: 'won',
                transaction_ids: { ...latestContract.transaction_ids, sell: sellTransactionId },
            };
            this.openContracts.set(contract_id, soldContract);
            this.publish({
                msg_type: 'transaction',
                transaction: {
                    action: 'sell',
                    amount: payout,
                    balance: balance_after_sell,
                    contract_id,
                    currency: latestAccount.currency,
                    transaction_id: sellTransactionId,
                },
            });
            this.publishBalance({ ...latestAccount, balance: balance_after_sell });
            this.publish({ msg_type: 'proposal_open_contract', proposal_open_contract: soldContract });
        }, 900);

        return Promise.resolve(response);
    }

    handleSell(request) {
        const contract = this.openContracts.get(Number(request.sell));
        if (contract?.is_sold) {
            const response = {
                echo_req: request,
                msg_type: 'sell',
                sell: {
                    sold_for: Number(contract.sell_price || 0),
                    transaction_id: contract.transaction_ids?.sell,
                },
            };
            setTimeout(() => {
                this.publish(response);
                this.publish({ msg_type: 'proposal_open_contract', proposal_open_contract: contract });
            }, 0);
            return Promise.resolve(response);
        }

        const sold_for = Number((contract?.sell_price || this.getPayoutForContract(contract?.contract_type, contract?.buy_price || 1)).toFixed(2));
        const profit = Number((sold_for - Number(contract?.buy_price || 0)).toFixed(2));
        const account = getActiveAccount();
        const balance_after_sell = updateAccountBalance(account.loginid, account.balance + sold_for).balance;
        const transaction_id = this.nextTransactionId++;
        const soldContract = {
            ...(contract || {}),
            bid_price: sold_for,
            date_expiry: contract?.date_expiry ?? now(),
            exit_tick: contract?.exit_tick ?? getPrice('1HZ100V'),
            exit_spot: contract?.exit_spot ?? contract?.exit_tick ?? getPrice('1HZ100V'),
            exit_tick_time: contract?.exit_tick_time ?? now(),
            is_expired: 1,
            is_sold: 1,
            is_valid_to_sell: 0,
            payout: sold_for,
            profit,
            sell_price: sold_for,
            status: 'won',
            transaction_ids: { ...(contract?.transaction_ids || {}), sell: transaction_id },
        };
        this.openContracts.set(Number(request.sell), soldContract);

        const response = {
            echo_req: request,
            msg_type: 'sell',
            sell: { sold_for, transaction_id },
        };

        setTimeout(() => {
            this.publish(response);
            this.publish({
                msg_type: 'transaction',
                transaction: {
                    action: 'sell',
                    amount: sold_for,
                    balance: balance_after_sell,
                    contract_id: Number(request.sell),
                    currency: account.currency,
                    transaction_id,
                },
            });
            this.publishBalance({ ...account, balance: balance_after_sell });
            this.publish({ msg_type: 'proposal_open_contract', proposal_open_contract: soldContract });
        }, 0);

        return Promise.resolve(response);
    }

    handleProposalOpenContract(request) {
        const contract = this.openContracts.get(Number(request.contract_id)) || {
            buy_price: 1,
            contract_id: Number(request.contract_id || this.nextContractId),
            currency: getActiveAccount().currency,
            is_expired: 1,
            is_sold: 1,
            is_valid_to_sell: 0,
            payout: 1.1,
            profit: 0.1,
            sell_price: 1.1,
            status: 'won',
            transaction_ids: {},
        };
        const response = {
            echo_req: request,
            msg_type: 'proposal_open_contract',
            proposal_open_contract: contract,
        };
        if (request.subscribe) response.subscription = { id: this.addIntervalSubscription('proposal_open_contract', () => response, 5000) };
        return Promise.resolve(response);
    }

    addIntervalSubscription(msg_type, createMessage, interval) {
        const id = `${msg_type}-${this.nextSubscriptionId++}`;
        const publish = () => this.publish({ ...createMessage(), subscription: { id } });
        const timer = setInterval(publish, interval);
        this.subscriptions.set(id, { msg_type, timer });
        setTimeout(publish, 0);
        return id;
    }

    getTradingTimes(request) {
        const symbolItems = ACTIVE_SYMBOLS.map(symbol => ({
            display_name: symbol.display_name,
            symbol: symbol.symbol,
            times: { close: ['23:59:59'], open: ['00:00:00'] },
            underlying_symbol: symbol.underlying_symbol,
        }));

        return {
            echo_req: request,
            msg_type: 'trading_times',
            trading_times: {
                markets: [
                    {
                        name: 'Derived',
                        submarkets: [
                            {
                                name: 'Continuous Indices',
                                symbols: symbolItems,
                            },
                        ],
                    },
                ],
            },
        };
    }

    getPayoutForContract(contractType, amount) {
        const stake = Number(amount || 1);
        if (contractType === 'DIGITMATCH') return Number((stake * 9.09).toFixed(2));
        if (contractType === 'DIGITDIFF') return Number((stake * 1.11).toFixed(2));
        if (contractType === 'DIGITEVEN' || contractType === 'DIGITODD') return Number((stake * 1.9).toFixed(2));
        if (contractType === 'DIGITOVER' || contractType === 'DIGITUNDER') return Number((stake * 1.85).toFixed(2));
        return Number((stake * 1.85).toFixed(2));
    }

    getWinningExitTick(contractType, entryTick, prediction) {
        if (contractType !== 'DIGITMATCH') return getPrice('1HZ100V', 1);

        const digit = Number.isFinite(Number(prediction)) ? Math.abs(Number(prediction)) % 10 : 0;
        const base = Math.floor(Number(entryTick || 100));
        return Number((base + digit / 100).toFixed(2));
    }
}

export const bootstrapMonkAccount = (loginid = getActiveLoginId()) => {
    const account = MONK_ACCOUNTS[loginid] || MONK_ACCOUNTS[DEFAULT_LOGINID];
    localStorage.setItem('active_loginid', account.loginid);
    localStorage.setItem('account_type', account.account_type);
    localStorage.setItem(
        'clientAccounts',
        JSON.stringify(
            getAccountList().reduce((accounts, item) => {
                accounts[item.loginid] = item;
                return accounts;
            }, {})
        )
    );
    sessionStorage.setItem('deriv_accounts', JSON.stringify(getStoredAccountList()));

    setConnectionStatus(CONNECTION_STATUS.OPENED);
    setAccountList(getAccountList());
    setAuthData({
        ...account,
        account_list: getAccountList(),
    });
    setIsAuthorized(true);
    setIsAuthorizing(false);
};

export const switchMonkAccount = loginid => bootstrapMonkAccount(loginid);

export const createMonkDataAPI = () => {
    bootstrapMonkAccount();
    return new MonkDataAPI();
};
