import { useT } from '../hooks/useT'

interface CryptoRowProps {
    name: string
    ticker: string
    price: string
    change: number
}

function CryptoRow({ name, ticker, price, change }: CryptoRowProps) {
    const isUp = change >= 0
    return (
        <div className="flex justify-between items-center py-2 border-b border-white/[0.06] last:border-0">
            <p className="text-sm font-medium text-[#f5f5f7]">{name} · <span className="text-[#888] font-normal">{ticker}</span></p>
            <p className="text-sm text-[#f5f5f7]">{price}</p>
            <p className={`text-xs ${isUp ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                {isUp ? '+' : ''}{change}%
            </p>
        </div>
    )
}

export default function CryptoWidget() {
    const t = useT()

    const coins = [
        { name: 'Bitcoin',  ticker: 'BTC', price: '$83,420', change: 2.4  },
        { name: 'Ethereum', ticker: 'ETH', price: '$3,180',  change: -0.8 },
        { name: 'Solana',   ticker: 'SOL', price: '$142.50', change: 5.1  },
    ]

    return (
        <div className="col-span-2 bg-[#2c2c2e] rounded-2xl p-5 border border-white/[0.08] flex flex-col justify-between">
            <p className="text-[11px] uppercase tracking-widest text-[#888] mb-2">{t.crypto.title}</p>
            <div className="flex-1 flex flex-col justify-center">
                {coins.map(c => <CryptoRow key={c.ticker} {...c} />)}
            </div>
            <p className="text-[11px] text-[#555] mt-2">{t.crypto.updatedAgo(2)}</p>
        </div>
    )
}