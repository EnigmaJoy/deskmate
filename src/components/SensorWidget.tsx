import { useT } from '../hooks/useT'
import { useDeskmate } from '../store/useDeskmate'

interface SensorItemProps {
    label: string
    value: number
    unit: string
    percentage: number
    accentColor: string
    alert?: boolean
    alertLabel?: string
}

function SensorItem({ label, value, unit, percentage, accentColor, alert, alertLabel }: SensorItemProps) {
    return (
        <div className={`rounded-xl p-4 flex flex-col justify-between transition-colors duration-300 ${
            alert ? 'bg-red-900/60 border border-red-500/50' : 'bg-[#3a3a3c]'
        }`}>
            <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-widest text-[#888]">{label}</p>
                {alert && (
                    <span className="text-[10px] uppercase tracking-wider text-red-400 font-semibold animate-pulse">
                        {alertLabel}
                    </span>
                )}
            </div>
            <p className={`text-3xl font-light mt-2 leading-none ${alert ? 'text-red-300' : 'text-[#f5f5f7]'}`}>
                {value}<span className={`text-sm ml-1 ${alert ? 'text-red-400/70' : 'text-[#888]'}`}>{unit}</span>
            </p>
            <div className="h-0.75 bg-[#555] rounded-full mt-3">
                <div
                    className="h-0.75 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, background: alert ? '#ef4444' : accentColor }}
                />
            </div>
        </div>
    )
}

interface SensorsWidgetProps {
    portrait?: boolean
}

export default function SensorsWidget({ portrait }: SensorsWidgetProps) {
    const t = useT()
    const distanceThreshold = useDeskmate(s => s.distanceThreshold)

    // TODO: valori reali da MQTT -
    const distance = 200
    const isDistanceAlert = distance < distanceThreshold

    const sensors = [
        { label: t.sensors.temperature, value: 22.4, unit: '°C', percentage: 62, accentColor: '#ff9f0a' },
        { label: t.sensors.humidity, value: 43,   unit: '%',  percentage: 43, accentColor: '#0a84ff' },
        {
            label: t.sensors.distance,
            value: 1.2,
            unit: 'm',
            percentage: 30,
            accentColor: '#30d158',
            alert: isDistanceAlert,
            alertLabel: t.sensors.alert,
        },
    ]

    return (
        <div className={`${portrait ? 'flex-1' : 'col-span-2'} bg-[#2c2c2e] rounded-2xl p-5 border border-white/8 flex flex-col`}>
            <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] uppercase tracking-widest text-[#888]">{t.sensors.title}</p>
                {isDistanceAlert && (
                    <p className="text-[11px] text-red-400 font-medium animate-pulse">
                        {t.sensors.tooClose}
                    </p>
                )}
            </div>
            <div className="grid grid-cols-3 gap-3 flex-1">
                {sensors.map(s => <SensorItem key={s.label} {...s} />)}
            </div>
        </div>
    )
}