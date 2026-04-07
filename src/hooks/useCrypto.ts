import { useState, useEffect, useRef } from 'react'
import {COINS, BINANCE_SYMBOLS, type CoinData} from '../lib/crypto'

const WS_URL = 'wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker'

export function useCrypto() {
    const [data, setData] = useState<CoinData[]>(COINS)
    const [error, setError] = useState(false)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
    const wsRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        const connect = () => {
            const ws = new WebSocket(WS_URL)
            wsRef.current = ws

            ws.onopen = () => setError(false)

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data)
                const ticker = msg.data
                const id = BINANCE_SYMBOLS[ticker.s]
                if (!id) return

                setData(prev => prev.map(coin =>
                    coin.id === id
                        ? {
                            ...coin,
                            price: parseFloat(ticker.c),
                            change24h: Math.round(parseFloat(ticker.P) * 100) / 100,
                        }
                        : coin
                ))
                setLastUpdate(new Date())
            }

            ws.onerror = () => setError(true)

            ws.onclose = () => {
                // riconnette dopo 3 secondi se chiude inaspettatamente
                setTimeout(connect, 3000)
            }
        }

        connect()

        return () => {
            wsRef.current?.close()
        }
    }, [])

    return { data, error, lastUpdate }
}