import { useState, useEffect } from 'react'
import { fetchWeather, type WeatherData } from '../lib/weather'
import { useDeskmate } from '../store/useDeskmate'

const REFRESH_MS = 10 * 60 * 1000

export function useWeather() {
    const location = useDeskmate(s => s.location)
    const [data, setData] = useState<WeatherData | null>(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        const load = async () => {
            try {
                const d = await fetchWeather(location.lat, location.lon)
                setData(d)
                setError(false)
            } catch {
                setError(true)
            }
        }

        load()
        const interval = setInterval(load, REFRESH_MS)
        return () => clearInterval(interval)
    }, [location])

    return { data, error }
}