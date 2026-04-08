import { useT } from '../hooks/useT'
import { useDeskmate } from '../store/useDeskmate'

function Divider() {
    return <div className="w-px h-8 bg-white/8" />
}

export default function StatusWidget() {
    const t = useT()
    const { brightness, volume } = useDeskmate()

    return (
        <div className="bg-[#2c2c2e] rounded-2xl p-5 border border-white/8 flex items-center justify-around">
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
        </div>
    )
}