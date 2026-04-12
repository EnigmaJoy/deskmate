import { useDeskmate } from '../store/useDeskmate'
import { useT } from '../hooks/useT'
import { LOCALES } from '../lib/i18n'
import type { Orientation } from '../store/useDeskmate'

const CITIES = [
    { name: 'Padova', lat: 45.4064, lon: 11.8768 },
    { name: 'Milano', lat: 45.4654, lon:  9.1859 },
    { name: 'Roma',   lat: 41.9028, lon: 12.4964 },
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
    { name: 'Tokyo',  lat: 35.6762, lon: 139.6503 },
]

interface SettingsProps {
    navigate: (page: 'dashboard' | 'settings') => void
}

function Pill({ active, onClick, children }: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
}) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                active
                    ? 'bg-white text-[#1c1c1e]'
                    : 'bg-[#3a3a3c] text-[#888] hover:text-[#f5f5f7]'
            }`}
        >
            {children}
        </button>
    )
}

export default function Settings({ navigate }: SettingsProps) {
    const t = useT()
    const {
        locale, setLocale,
        orientation, setOrientation,
        distanceThreshold, setDistanceThreshold,
        location, setLocation,
    } = useDeskmate()

    const isLandscape = orientation === 'landscape'
    const w = isLandscape ? 800 : 480
    const h = isLandscape ? 480 : 800

    return (
        <div
            className="bg-[#1c1c1e] overflow-y-auto"
            style={{ width: `${w}px`, height: `${h}px`, padding: '20px', boxSizing: 'border-box' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <button
                    onClick={() => navigate('dashboard')}
                    className="text-[#0a84ff] text-sm font-medium"
                >
                    {t.settings.back}
                </button>
                <p className="text-[11px] uppercase tracking-widest text-[#888]">
                    {t.settings.title}
                </p>
                <div className="w-20" />
            </div>

            {/* Sections grid: 2 columns in landscape, 1 in portrait */}
            <div className={`grid gap-4 ${isLandscape ? 'grid-cols-2' : 'grid-cols-1'}`}>

                {/* Language */}
                <div className="bg-[#2c2c2e] rounded-2xl p-4 border border-white/8">
                    <p className="text-[11px] uppercase tracking-widest text-[#888] mb-3">
                        {t.settings.language}
                    </p>
                    <div className="flex gap-2">
                        {LOCALES.map(l => (
                            <Pill key={l} active={locale === l} onClick={() => setLocale(l)}>
                                {l.toUpperCase()}
                            </Pill>
                        ))}
                    </div>
                </div>

                {/* Orientation */}
                <div className="bg-[#2c2c2e] rounded-2xl p-4 border border-white/8">
                    <p className="text-[11px] uppercase tracking-widest text-[#888] mb-3">
                        {t.settings.orientation}
                    </p>
                    <div className="flex gap-2">
                        {(['landscape', 'portrait'] as Orientation[]).map(o => (
                            <Pill key={o} active={orientation === o} onClick={() => setOrientation(o)}>
                                {o === 'landscape'
                                    ? `↔ ${t.settings.landscape}`
                                    : `↕ ${t.settings.portrait}`}
                            </Pill>
                        ))}
                    </div>
                </div>

                {/* Distance threshold */}
                <div className="bg-[#2c2c2e] rounded-2xl p-4 border border-white/8">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] uppercase tracking-widest text-[#888]">
                            {t.settings.distanceThreshold}
                        </p>
                        <p className="text-sm font-medium text-[#f5f5f7]">
                            {distanceThreshold} cm
                        </p>
                    </div>
                    <input
                        type="range"
                        min={10}
                        max={300}
                        step={5}
                        value={distanceThreshold}
                        onChange={e => setDistanceThreshold(Number(e.target.value))}
                        className="w-full accent-[#0a84ff]"
                    />
                </div>

                {/* City */}
                <div className="bg-[#2c2c2e] rounded-2xl p-4 border border-white/8">
                    <p className="text-[11px] uppercase tracking-widest text-[#888] mb-3">
                        {t.settings.city}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {CITIES.map(city => (
                            <Pill
                                key={city.name}
                                active={location.name === city.name}
                                onClick={() => setLocation(city)}
                            >
                                {city.name}
                            </Pill>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
