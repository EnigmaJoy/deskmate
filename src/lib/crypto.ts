export interface CoinData {
    id: string
    name: string
    ticker: string
    price: number
    change24h: number
}

export const COINS: CoinData[] = [
    { id: 'bitcoin',  name: 'Bitcoin',  ticker: 'BTC', price: 0, change24h: 0 },
    { id: 'ethereum', name: 'Ethereum', ticker: 'ETH', price: 0, change24h: 0 },
    { id: 'solana',   name: 'Solana',   ticker: 'SOL', price: 0, change24h: 0 },
]

// Mappa ticker Binance → id
export const BINANCE_SYMBOLS: Record<string, string> = {
    BTCUSDT: 'bitcoin',
    ETHUSDT: 'ethereum',
    SOLUSDT: 'solana',
}