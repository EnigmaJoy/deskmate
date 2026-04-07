import { useState, useEffect } from 'react'
import { fetchWeather } from '../lib/weather'
import type { WeatherData } from '../lib/weather'

const PADOVA = { lat: 45.4064, lon: 11.8768 }
const REFRESH_MS = 10 * 60 * 1000 // aggiorna ogni 10 minuti

export function useWeather() {
    const [data, setData] = useState<WeatherData | null>(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        const load = async () => {
            try {
                const d = await fetchWeather(PADOVA.lat, PADOVA.lon)
                setData(d)
                setError(false)
            } catch {
                setError(true)
            }
        }

        load()
        const interval = setInterval(load, REFRESH_MS)
        return () => clearInterval(interval)
    }, [])

    return { data, error }
}