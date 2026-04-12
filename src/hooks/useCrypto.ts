import { useState, useEffect, useRef } from 'react'
import { COINS, BINANCE_SYMBOLS, type CoinData } from '../lib/crypto'

const WS_URL = 'wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker'

export function useCrypto() {
    const [data, setData] = useState<CoinData[] | null>(null)
    const [error, setError] = useState(false)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
    const wsRef = useRef<WebSocket | null>(null)
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        let unmounted = false

        const connect = () => {
            const ws = new WebSocket(WS_URL)
            wsRef.current = ws

            ws.onopen = () => {
                if (!unmounted) setError(false)
            }

            ws.onmessage = (event) => {
                if (unmounted) return
                const msg = JSON.parse(event.data)
                const ticker = msg.data
                const id = BINANCE_SYMBOLS[ticker.s]
                if (!id) return

                setData(prev => {
                    const base = prev ?? COINS
                    return base.map(coin =>
                        coin.id === id
                            ? {
                                ...coin,
                                price: parseFloat(ticker.c),
                                change24h: Math.round(parseFloat(ticker.P) * 100) / 100,
                            }
                            : coin
                    )
                })
                if (!unmounted) setLastUpdate(new Date())
            }

            ws.onerror = () => {
                if (!unmounted) setError(true)
            }

            ws.onclose = () => {
                if (!unmounted) {
                    reconnectTimerRef.current = setTimeout(connect, 3000)
                }
            }
        }

        connect()

        return () => {
            unmounted = true
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current)
                reconnectTimerRef.current = null
            }
            if (wsRef.current) {
                wsRef.current.onclose = null   // prevent reconnect scheduling on close
                wsRef.current.close()
                wsRef.current = null
            }
        }
    }, [])

    return { data, error, lastUpdate }
}