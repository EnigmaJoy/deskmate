import { useWeather } from '../hooks/useWeather'
import { useT } from '../hooks/useT'
import { useDeskmate } from '../store/useDeskmate'

interface WeatherWidgetProps {
    portrait?: boolean
}

export default function WeatherWidget({ portrait }: WeatherWidgetProps) {
    const { data, error } = useWeather()
    const t = useT()
    const location = useDeskmate(s => s.location)
    const base = `${portrait ? 'flex-1 ' : ''}bg-[#2c2c2e] rounded-2xl p-5 border border-white/8`

    if (error) return (
        <div className={`${base} flex items-center justify-center`}>
            <p className="text-[#888] text-xs">{t.weather.unavailable}</p>
        </div>
    )

    if (!data) return (
        <div className={`${base} flex items-center justify-center`}>
            <p className="text-[#888] text-xs animate-pulse">{t.weather.loading}</p>
        </div>
    )

    return (
        <div className={`${base} flex flex-row gap-3`}>
            <div className="flex flex-col">

                <div className="flex items-baseline gap-3">
                    <p className="text-4xl font-extralight text-[#f5f5f7] leading-none tracking-tight">
                        {data.temperature}°
                    </p>
                    <p className="text-xs text-[#888]">
                        {t.wmo[data.weatherCode] ?? '—'}
                    </p>
                </div>
            </div>
            <div className="flex flex-col">
                <p className="text-[11px] uppercase tracking-widest text-[#888]">
                    {t.weather.title(location.name)}
                </p></div>
            <div className="flex flex-col">
                <div className="flex justify-between text-xs text-[#888]">
                <span>
                    {t.weather.min} <span className="text-[#f5f5f7]">{data.tempMin}°</span> · {t.weather.max} <span className="text-[#f5f5f7]">{data.tempMax}°</span>
                </span>
                    <span>
                    {t.weather.wind} <span className="text-[#f5f5f7]">{data.windspeed} km/h</span> · {t.weather.humidity} <span className="text-[#f5f5f7]">{data.humidity}%</span>
                </span>
                </div>
            </div>
        </div>
    )
}