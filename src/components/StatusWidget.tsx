import { useT } from '../hooks/useT'
import { useDeskmate } from '../store/useDeskmate'
import type { Page } from '../types'

interface StatusWidgetProps {
    navigate: (page: Page) => void
    portrait?: boolean
}

function Divider() {
    return <div className="w-px h-8 bg-white/8" />
}

export default function StatusWidget({ navigate, portrait }: StatusWidgetProps) {
    const t = useT()
    const { brightness, volume } = useDeskmate()

    const gearButton = (
        <button
            onClick={() => navigate('settings')}
            className="text-[#555] hover:text-[#888] transition-colors"
            aria-label="Settings"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        </button>
    )

    const statusItems = (
        <>
            <div className="flex flex-col items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#30d158]" />
                <p className="text-[10px] uppercase tracking-widest text-[#888]">MQTT</p>
            </div>
            <Divider />
            <div className="flex flex-col items-center gap-1">
                <p className="text-lg font-light text-[#f5f5f7]">{brightness}%</p>
                <p className="text-[10px] uppercase tracking-widest text-[#888]">{t.status.brightness}</p>
            </div>
            <Divider />
            <div className="flex flex-col items-center gap-1">
                <p className="text-lg font-light text-[#f5f5f7]">{volume}%</p>
                <p className="text-[10px] uppercase tracking-widest text-[#888]">{t.status.volume}</p>
            </div>
        </>
    )

    if (portrait) {
        return (
            <div className="flex-1 bg-[#2c2c2e] rounded-2xl p-5 border border-white/8 flex flex-col gap-2">
                <div className="flex justify-end">{gearButton}</div>
                <div className="flex-1 flex items-center justify-around">{statusItems}</div>
            </div>
        )
    }

    return (
        <div className="relative bg-[#2c2c2e] rounded-2xl p-5 border border-white/8 flex items-center justify-around">
            <div className="absolute top-3 right-3">{gearButton}</div>
            {statusItems}
        </div>
    )
}
