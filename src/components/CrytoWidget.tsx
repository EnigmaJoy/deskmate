import { useCrypto } from '../hooks/useCrypto'
import { useT } from '../hooks/useT'

interface CryptoRowProps {
    name: string
    ticker: string
    price: number
    change: number
}

function CryptoRow({ name, ticker, price, change }: CryptoRowProps) {
    const isUp = change >= 0
    return (
        <div className="grid py-2 border-b border-white/6 last:border-0"
             style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0 24px' }}>
            <p className="text-sm font-medium text-[#f5f5f7]">
                {name} ·
            </p>
            <p className="text-[#888] font-normal">{ticker}</p>
            <p className="text-sm text-[#f5f5f7] text-right tabular-nums">
                ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className={`text-sm text-right tabular-nums w-14 ${isUp ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                {isUp ? '+' : ''}{change}%
            </p>
        </div>
    )
}

function minutesAgo(date: Date): number {
    return Math.floor((Date.now() - date.getTime()) / 60000)
}

export default function CryptoWidget() {
    const t = useT()
    const { data, error, lastUpdate } = useCrypto()

    if (error) return (
        <div className="col-span-2 bg-[#2c2c2e] rounded-2xl p-5 border border-white/[0.08] flex items-center justify-center">
            <p className="text-[#888] text-xs">{t.crypto.unavailable}</p>
        </div>
    )

    if (!data) return (
        <div className="col-span-2 bg-[#2c2c2e] rounded-2xl p-5 border border-white/[0.08] flex items-center justify-center">
            <p className="text-[#888] text-xs animate-pulse">{t.crypto.loading}</p>
        </div>
    )

    return (
        <div className="col-span-2 bg-[#2c2c2e] rounded-2xl p-5 border border-white/[0.08] flex flex-col justify-between">
            <p className="text-[11px] uppercase tracking-widest text-[#888] mb-2">{t.crypto.title}</p>
            <div className="flex-1 flex flex-col justify-center">
                {data.map(c => <CryptoRow key={c.id} name={c.name} ticker={c.ticker} price={c.price} change={c.change24h} />)}
            </div>
            {lastUpdate && (
                <p className="text-[11px] text-[#555] mt-2">
                    {t.crypto.updatedAgo(minutesAgo(lastUpdate))}
                </p>
            )}
        </div>
    )
}