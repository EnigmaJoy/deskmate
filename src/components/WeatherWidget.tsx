import { useWeather } from '../hooks/useWeather'
import { useT } from '../hooks/useT'
import { useDeskmate } from '../store/useDeskmate'

export default function WeatherWidget() {
    const { data, error } = useWeather()
    const t = useT()
    const location = useDeskmate(s => s.location)

    if (error) return (
        <div className="bg-[#2c2c2e] rounded-2xl p-5 border border-white/[0.08] flex items-center justify-center">
            <p className="text-[#888] text-xs">{t.weather.unavailable}</p>
        </div>
    )

    if (!data) return (
        <div className="bg-[#2c2c2e] rounded-2xl p-5 border border-white/[0.08] flex items-center justify-center">
            <p className="text-[#888] text-xs animate-pulse">{t.weather.loading}</p>
        </div>
    )

    return (
        <div className="bg-[#2c2c2e] rounded-2xl p-5 border border-white/[0.08] flex flex-col justify-between">
            <p className="text-[11px] uppercase tracking-widest text-[#888]">
                {t.weather.title(location.name)}
            </p>

            <div>
                <p className="text-5xl font-extralight text-[#f5f5f7] leading-none tracking-tight">
                    {data.temperature}°
                </p>
                <p className="text-xs text-[#888] mt-1">
                    {t.wmo[data.weatherCode] ?? '—'}
                </p>
            </div>

            <div className="flex flex-col gap-1">
                <p className="text-xs text-[#888]">
                    {t.weather.min} <span className="text-[#f5f5f7]">{data.tempMin}°</span> · {t.weather.max} <span className="text-[#f5f5f7]">{data.tempMax}°</span>
                </p>
                <p className="text-xs text-[#888]">
                    {t.weather.wind} <span className="text-[#f5f5f7]">{data.windspeed} km/h</span> · {t.weather.humidity} <span className="text-[#f5f5f7]">{data.humidity}%</span>
                </p>
            </div>
        </div>
    )
}