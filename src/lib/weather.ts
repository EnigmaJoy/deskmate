export interface WeatherData {
    temperature: number
    weatherCode: number
    windspeed: number
    humidity: number
    tempMin: number
    tempMax: number
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m&daily=temperature_2m_min,temperature_2m_max&timezone=auto&forecast_days=1`

    const res = await fetch(url)
    if (!res.ok) throw new Error('Errore fetch meteo')
    const data = await res.json()

    return {
        temperature: Math.round(data.current.temperature_2m),
        weatherCode: data.current.weathercode,
        windspeed: Math.round(data.current.windspeed_10m),
        humidity: data.current.relative_humidity_2m,
        tempMin: Math.round(data.daily.temperature_2m_min[0]),
        tempMax: Math.round(data.daily.temperature_2m_max[0]),
    }
}