import { useT } from '../hooks/useT'

interface SensorItemProps {
    label: string
    value: number
    unit: string
    percentage: number
    accentColor: string
}

function SensorItem({ label, value, unit, percentage, accentColor }: SensorItemProps) {
    return (
        <div className="bg-[#3a3a3c] rounded-xl p-4 flex flex-col justify-between">
            <p className="text-[11px] uppercase tracking-widest text-[#888]">{label}</p>
            <p className="text-3xl font-light text-[#f5f5f7] mt-2 leading-none">
                {value}<span className="text-[#888] text-sm ml-1">{unit}</span>
            </p>
            <div className="h-[3px] bg-[#555] rounded-full mt-3">
                <div
                    className="h-[3px] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, background: accentColor }}
                />
            </div>
        </div>
    )
}

export default function SensorsWidget() {
    const t = useT()

    const SOGLIA_CM = 100;
    const distanza: number = 200;

    if (distanza < SOGLIA_CM) {
        // mostra notifica rossa
        // notifica di allerta - cambia colore bkg card - due stati
    }

    const sensors = [
        { label: t.sensors.temperature, value: 22.4, unit: '°C', percentage: 62, accentColor: '#ff9f0a' },
        { label: t.sensors.humidity, value: 43,   unit: '%',  percentage: 43, accentColor: '#0a84ff' },
        { label: t.sensors.distance, value: 1.2,  unit: 'm',  percentage: 30, accentColor: '#30d158' },
    ]

    return (
        <div className="col-span-2 bg-[#2c2c2e] rounded-2xl p-5 border border-white/[0.08] flex flex-col">
            <p className="text-[11px] uppercase tracking-widest text-[#888] mb-3">{t.sensors.title}</p>
            <div className="grid grid-cols-3 gap-3 flex-1">
                {sensors.map(s => <SensorItem key={s.label} {...s} />)}
            </div>
        </div>
    )
}