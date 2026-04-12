# Deskmate Stable Build — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the Deskmate dashboard to a stable, buildable state with routing, Settings page, orientation support, crypto fixes, and complete WMO codes.

**Architecture:** State-based routing (no react-router-dom) in App.tsx; orientation stored in Zustand and consumed by Dashboard/Settings to switch between fixed 800×480 and 480×800 layouts; Settings built as a new page with four card sections.

**Tech Stack:** React 19 + TypeScript + Tailwind v4 + Zustand 5 + Vite 8

> **Plan note:** The spec stated "widget components receive no new props". This is revised: `SensorsWidget` and `CryptoWidget` each receive an optional `portrait?: boolean` prop so they can switch from `col-span-2` to `col-span-1` in the portrait 1-column grid. This is the minimal change needed to avoid CSS Grid creating implicit columns.

---

## File map

| File | Action |
|------|--------|
| `src/store/useDeskmate.ts` | Add `Orientation` type, `orientation` state, `setOrientation` |
| `src/hooks/useCrypto.ts` | `null` init, `reconnectTimerRef`, unmount guard |
| `src/lib/i18n.ts` | Add 15 missing WMO codes + `settings` section in all 3 locales |
| `src/App.tsx` | State-based router, render Dashboard or Settings |
| `src/components/StatusWidget.tsx` | Add `navigate` prop + inline gear SVG |
| `src/components/SensorWidget.tsx` | Add `portrait?: boolean` prop → `col-span-1` in portrait |
| `src/components/CrytoWidget.tsx` | Add `portrait?: boolean` prop → `col-span-1` in portrait |
| `src/pages/Dashboard.tsx` | Read orientation, two grid configs, pass props |
| `src/pages/Settings.tsx` | Full implementation (currently empty) |

No new files. No new dependencies.

---

## Task 1 — Add `orientation` to Zustand store

**Files:**
- Modify: `src/store/useDeskmate.ts`

- [ ] **Step 1: Replace the file content**

```ts
import { create } from 'zustand'
import type { Locale } from '../lib/i18n'

export type Orientation = 'landscape' | 'portrait'

export interface Location {
    name: string
    lat: number
    lon: number
}

interface DeskmateStore {
    locale: Locale
    brightness: number
    volume: number
    location: Location
    distanceThreshold: number
    orientation: Orientation
    setLocale: (l: Locale) => void
    setBrightness: (v: number) => void
    setVolume: (v: number) => void
    setLocation: (l: Location) => void
    setDistanceThreshold: (cm: number) => void
    setOrientation: (o: Orientation) => void
}

export const useDeskmate = create<DeskmateStore>((set) => ({
    locale: 'it',
    brightness: 85,
    volume: 60,
    location: { name: 'Padova', lat: 45.4064, lon: 11.8768 },
    distanceThreshold: 100,
    orientation: 'landscape',
    setLocale: (locale) => set({ locale }),
    setBrightness: (brightness) => set({ brightness }),
    setVolume: (volume) => set({ volume }),
    setLocation: (location) => set({ location }),
    setDistanceThreshold: (distanceThreshold) => set({ distanceThreshold }),
    setOrientation: (orientation) => set({ orientation }),
}))
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`  
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/store/useDeskmate.ts
git commit -m "feat(DSKMT-003): add orientation to store"
```

---

## Task 2 — Fix `useCrypto`: null init + memory leak

**Files:**
- Modify: `src/hooks/useCrypto.ts`

- [ ] **Step 1: Replace the file content**

```ts
import { useState, useEffect, useRef } from 'react'
import { COINS, BINANCE_SYMBOLS, type CoinData } from '../lib/crypto'

const WS_URL = 'wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker'

export function useCrypto() {
    const [data, setData] = useState<CoinData[] | null>(null)
    const [error, setError] = useState(false)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
    const wsRef = useRef<WebSocket | null>(null)
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        let unmounted = false

        const connect = () => {
            const ws = new WebSocket(WS_URL)
            wsRef.current = ws

            ws.onopen = () => {
                if (!unmounted) setError(false)
            }

            ws.onmessage = (event) => {
                if (unmounted) return
                const msg = JSON.parse(event.data)
                const ticker = msg.data
                const id = BINANCE_SYMBOLS[ticker.s]
                if (!id) return

                setData(prev => {
                    const base = prev ?? COINS
                    return base.map(coin =>
                        coin.id === id
                            ? {
                                ...coin,
                                price: parseFloat(ticker.c),
                                change24h: Math.round(parseFloat(ticker.P) * 100) / 100,
                            }
                            : coin
                    )
                })
                setLastUpdate(new Date())
            }

            ws.onerror = () => {
                if (!unmounted) setError(true)
            }

            ws.onclose = () => {
                if (!unmounted) {
                    reconnectTimerRef.current = setTimeout(connect, 3000)
                }
            }
        }

        connect()

        return () => {
            unmounted = true
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current)
                reconnectTimerRef.current = null
            }
            if (wsRef.current) {
                wsRef.current.onclose = null   // prevent reconnect scheduling on close
                wsRef.current.close()
                wsRef.current = null
            }
        }
    }, [])

    return { data, error, lastUpdate }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`  
Expected: no errors

- [ ] **Step 3: Verify CryptoWidget still handles `data === null`**

Open `src/components/CrytoWidget.tsx` and confirm the guard:
```tsx
if (!data) return (
    <div className="col-span-2 ...">
        <p className="text-[#888] text-xs animate-pulse">{t.crypto.loading}</p>
    </div>
)
```
This guard is already present — no change needed.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useCrypto.ts
git commit -m "fix(DSKMT-003): null init and memory leak in useCrypto"
```

---

## Task 3 — Complete i18n: WMO codes + settings translations

**Files:**
- Modify: `src/lib/i18n.ts`

This task adds 15 missing WMO weather codes and a new `settings` section to all 3 locales.  
The `Translations` type is derived from `typeof translations.it`, so TypeScript will catch any missing key in `en` or `zh`.

- [ ] **Step 1: Replace the file content**

```ts
export type Locale = 'it' | 'en' | 'zh'

export const LOCALES: Locale[] = ['it', 'en', 'zh']

const translations = {
    it: {
        weather: {
            title: (city: string) => `Meteo · ${city}`,
            loading: 'Caricamento...',
            unavailable: 'Meteo non disponibile',
            min: 'Min',
            max: 'Max',
            wind: 'Vento',
            humidity: 'Umidità',
        },
        sensors: {
            title: 'Sensori',
            temperature: 'Temperatura',
            humidity: 'Umidità',
            distance: 'Distanza',
            alert: 'Allerta',
            tooClose: 'Oggetto troppo vicino!',
        },
        crypto: {
            title: 'Crypto',
            updatedAgo: (min: number) => `Aggiornato ${min} min fa`,
            unavailable: 'Crypto non disponibile',
            loading: 'Caricamento...',
        },
        status: {
            brightness: 'Luminosità',
            volume: 'Volume',
        },
        settings: {
            title: 'Impostazioni',
            back: '← Dashboard',
            language: 'Lingua',
            orientation: 'Orientamento',
            landscape: 'Orizzontale',
            portrait: 'Verticale',
            distanceThreshold: 'Soglia Distanza',
            city: 'Città',
        },
        wmo: {
            0: 'Sereno',
            1: 'Prevalentemente sereno',
            2: 'Parzialmente nuvoloso',
            3: 'Nuvoloso',
            45: 'Nebbia',
            48: 'Nebbia ghiacciata',
            51: 'Pioggerella leggera',
            53: 'Pioggerella moderata',
            55: 'Pioggerella densa',
            56: 'Pioggerella ghiacciata leggera',
            57: 'Pioggerella ghiacciata intensa',
            61: 'Pioggia leggera',
            63: 'Pioggia moderata',
            65: 'Pioggia intensa',
            66: 'Pioggia ghiacciata leggera',
            67: 'Pioggia ghiacciata intensa',
            71: 'Neve leggera',
            73: 'Neve moderata',
            75: 'Neve intensa',
            77: 'Granuli di neve',
            80: 'Rovesci leggeri',
            81: 'Rovesci moderati',
            82: 'Rovesci violenti',
            85: 'Rovesci di neve leggeri',
            86: 'Rovesci di neve intensi',
            95: 'Temporale',
            96: 'Temporale con grandine leggera',
            99: 'Temporale con grandine intensa',
        } as Record<number, string>,
    },

    en: {
        weather: {
            title: (city: string) => `Weather · ${city}`,
            loading: 'Loading...',
            unavailable: 'Weather unavailable',
            min: 'Min',
            max: 'Max',
            wind: 'Wind',
            humidity: 'Humidity',
        },
        sensors: {
            title: 'Sensors',
            temperature: 'Temperature',
            humidity: 'Humidity',
            distance: 'Distance',
            alert: 'Alert',
            tooClose: 'Object too close!',
        },
        crypto: {
            title: 'Crypto',
            updatedAgo: (min: number) => `Updated ${min} min ago`,
            unavailable: 'Crypto unavailable',
            loading: 'Loading...',
        },
        status: {
            brightness: 'Brightness',
            volume: 'Volume',
        },
        settings: {
            title: 'Settings',
            back: '← Dashboard',
            language: 'Language',
            orientation: 'Orientation',
            landscape: 'Landscape',
            portrait: 'Portrait',
            distanceThreshold: 'Distance Threshold',
            city: 'City',
        },
        wmo: {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Icy fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            56: 'Light freezing drizzle',
            57: 'Heavy freezing drizzle',
            61: 'Light rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            66: 'Light freezing rain',
            67: 'Heavy freezing rain',
            71: 'Light snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            77: 'Snow grains',
            80: 'Light showers',
            81: 'Moderate showers',
            82: 'Violent showers',
            85: 'Slight snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail',
        } as Record<number, string>,
    },

    zh: {
        weather: {
            title: (city: string) => `天气 · ${city}`,
            loading: '加载中...',
            unavailable: '天气不可用',
            min: '最低',
            max: '最高',
            wind: '风速',
            humidity: '湿度',
        },
        sensors: {
            title: '传感器',
            temperature: '温度',
            humidity: '湿度',
            distance: '距离',
            alert: '警报',
            tooClose: '物体太近！',
        },
        crypto: {
            title: '加密货币',
            updatedAgo: (min: number) => `${min} 分钟前更新`,
            unavailable: '加密货币不可用',
            loading: '加载中...',
        },
        status: {
            brightness: '亮度',
            volume: '音量',
        },
        settings: {
            title: '设置',
            back: '← 仪表盘',
            language: '语言',
            orientation: '方向',
            landscape: '横向',
            portrait: '纵向',
            distanceThreshold: '距离阈值',
            city: '城市',
        },
        wmo: {
            0: '晴天',
            1: '基本晴朗',
            2: '局部多云',
            3: '阴天',
            45: '雾',
            48: '冻雾',
            51: '小毛毛雨',
            53: '中等毛毛雨',
            55: '密毛毛雨',
            56: '轻度冻毛毛雨',
            57: '重度冻毛毛雨',
            61: '小雨',
            63: '中雨',
            65: '大雨',
            66: '轻度冻雨',
            67: '重度冻雨',
            71: '小雪',
            73: '中雪',
            75: '大雪',
            77: '雪粒',
            80: '小阵雨',
            81: '中等阵雨',
            82: '强阵雨',
            85: '小阵雪',
            86: '大阵雪',
            95: '雷暴',
            96: '伴有小冰雹的雷暴',
            99: '伴有大冰雹的雷暴',
        } as Record<number, string>,
    },
} as const

export type Translations = typeof translations.it
export { translations }
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`  
Expected: no errors (all three locales have identical `settings` keys → type check passes)

- [ ] **Step 3: Commit**

```bash
git add src/lib/i18n.ts
git commit -m "feat(DSKMT-003): complete WMO codes and add settings translations"
```

---

## Task 4 — State-based router in `App.tsx`

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace the file content**

```tsx
import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'

type Page = 'dashboard' | 'settings'

function App() {
    const [page, setPage] = useState<Page>('dashboard')

    return (
        <div className="w-screen h-screen bg-gray-950 overflow-hidden flex items-center justify-center">
            {page === 'dashboard'
                ? <Dashboard navigate={setPage} />
                : <Settings navigate={setPage} />
            }
        </div>
    )
}

export default App
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`  
Expected: errors for `navigate` prop not yet defined on Dashboard/Settings — this is expected. Resolve in Tasks 5–8.

- [ ] **Step 3: Do NOT commit yet** — depends on Tasks 5–8 to compile cleanly.

---

## Task 5 — Add gear icon to `StatusWidget`

**Files:**
- Modify: `src/components/StatusWidget.tsx`

- [ ] **Step 1: Replace the file content**

```tsx
import { useT } from '../hooks/useT'
import { useDeskmate } from '../store/useDeskmate'

interface StatusWidgetProps {
    navigate: (page: 'dashboard' | 'settings') => void
}

function Divider() {
    return <div className="w-px h-8 bg-white/8" />
}

export default function StatusWidget({ navigate }: StatusWidgetProps) {
    const t = useT()
    const { brightness, volume } = useDeskmate()

    return (
        <div className="relative bg-[#2c2c2e] rounded-2xl p-5 border border-white/8 flex items-center justify-around">
            <button
                onClick={() => navigate('settings')}
                className="absolute top-3 right-3 text-[#555] hover:text-[#888] transition-colors"
                aria-label="Settings"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            </button>

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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`  
Expected: `navigate` prop is now defined on StatusWidget → errors reduce. Dashboard still errors since it doesn't pass `navigate` to StatusWidget yet.

---

## Task 6 — Add `portrait` prop to `SensorsWidget` and `CryptoWidget`

**Why:** In the portrait 1-column grid, these widgets' hardcoded `col-span-2` would force CSS Grid to create an implicit second column, breaking the layout. `portrait={true}` switches them to `col-span-1`.

**Files:**
- Modify: `src/components/SensorWidget.tsx`
- Modify: `src/components/CrytoWidget.tsx`

- [ ] **Step 1: Update SensorWidget — add `portrait` prop**

In `src/components/SensorWidget.tsx`, change the `SensorsWidget` function signature and root div class:

Old:
```tsx
export default function SensorsWidget() {
    const t = useT()
    const distanceThreshold = useDeskmate(s => s.distanceThreshold)
```

New:
```tsx
interface SensorsWidgetProps {
    portrait?: boolean
}

export default function SensorsWidget({ portrait }: SensorsWidgetProps) {
    const t = useT()
    const distanceThreshold = useDeskmate(s => s.distanceThreshold)
```

And the root div:

Old:
```tsx
    return (
        <div className="col-span-2 bg-[#2c2c2e] rounded-2xl p-5 border border-white/8 flex flex-col">
```

New:
```tsx
    return (
        <div className={`${portrait ? 'col-span-1' : 'col-span-2'} bg-[#2c2c2e] rounded-2xl p-5 border border-white/8 flex flex-col`}>
```

- [ ] **Step 2: Update CryptoWidget — add `portrait` prop**

In `src/components/CrytoWidget.tsx`, change the `CryptoWidget` function signature and root divs:

Old:
```tsx
export default function CryptoWidget() {
    const t = useT()
    const { data, error, lastUpdate } = useCrypto()

    if (error) return (
        <div className="col-span-2 bg-[#2c2c2e] rounded-2xl p-5 border border-white/8 flex items-center justify-center">
```

New:
```tsx
interface CryptoWidgetProps {
    portrait?: boolean
}

export default function CryptoWidget({ portrait }: CryptoWidgetProps) {
    const t = useT()
    const { data, error, lastUpdate } = useCrypto()
    const spanClass = portrait ? 'col-span-1' : 'col-span-2'

    if (error) return (
        <div className={`${spanClass} bg-[#2c2c2e] rounded-2xl p-5 border border-white/8 flex items-center justify-center`}>
```

Also update the loading state div and main return div in CryptoWidget:

Loading state div — old:
```tsx
    if (!data) return (
        <div className="col-span-2 bg-[#2c2c2e] rounded-2xl p-5 border border-white/8 flex items-center justify-center">
```

New:
```tsx
    if (!data) return (
        <div className={`${spanClass} bg-[#2c2c2e] rounded-2xl p-5 border border-white/8 flex items-center justify-center`}>
```

Main return div — old:
```tsx
    return (
        <div className="col-span-2 bg-[#2c2c2e] rounded-2xl p-5 border border-white/8 flex flex-col justify-between">
```

New:
```tsx
    return (
        <div className={`${spanClass} bg-[#2c2c2e] rounded-2xl p-5 border border-white/8 flex flex-col justify-between`}>
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`  
Expected: no new errors from these two files

---

## Task 7 — Dashboard: orientation-aware layout

**Files:**
- Modify: `src/pages/Dashboard.tsx`

- [ ] **Step 1: Replace the file content**

```tsx
import SensorsWidget from "../components/SensorWidget.tsx"
import WeatherWidget from "../components/WeatherWidget.tsx"
import CryptoWidget from "../components/CrytoWidget.tsx"
import StatusWidget from "../components/StatusWidget.tsx"
import { useDeskmate } from '../store/useDeskmate'

interface DashboardProps {
    navigate: (page: 'dashboard' | 'settings') => void
}

export default function Dashboard({ navigate }: DashboardProps) {
    const orientation = useDeskmate(s => s.orientation)

    if (orientation === 'portrait') {
        return (
            <div style={{
                width: '480px',
                height: '800px',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gridTemplateRows: '1fr 1fr 1fr 1fr',
                gap: '12px',
                padding: '20px',
                background: '#1c1c1e',
                boxSizing: 'border-box',
            }}>
                <SensorsWidget portrait />
                <WeatherWidget />
                <CryptoWidget portrait />
                <StatusWidget navigate={navigate} />
            </div>
        )
    }

    return (
        <div style={{
            width: '800px',
            height: '480px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: '12px',
            padding: '20px',
            background: '#1c1c1e',
            boxSizing: 'border-box',
        }}>
            <SensorsWidget />
            <WeatherWidget />
            <CryptoWidget />
            <StatusWidget navigate={navigate} />
        </div>
    )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`  
Expected: remaining errors only from `Settings` (still empty) and `navigate` passed to `Settings` in App.tsx

---

## Task 8 — Settings page: full implementation

**Files:**
- Modify: `src/pages/Settings.tsx`

- [ ] **Step 1: Replace the file content**

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles with zero errors**

Run: `npx tsc --noEmit`  
Expected: 0 errors

- [ ] **Step 3: Run dev server and verify visually**

Run: `npm run dev`

Check:
- Dashboard renders at 800×480 with gear icon visible in StatusWidget bottom-right
- Clicking gear → Settings page appears
- Settings: all 4 sections visible in landscape 2-column layout
- Changing language → all widget labels update immediately
- Changing orientation → switching to portrait and back to Dashboard shows 480×800 single-column layout
- Distance slider moves and updates value live
- City selection highlights active city; WeatherWidget updates to new location
- Back button returns to Dashboard
- CryptoWidget shows loading animation before WebSocket connects (not `$0.00`)

- [ ] **Step 4: Run build**

Run: `npm run build`  
Expected: build completes with no TypeScript or Vite errors. Output in `dist/`.

- [ ] **Step 5: Commit all remaining changes**

```bash
git add src/App.tsx src/components/StatusWidget.tsx src/components/SensorWidget.tsx src/components/CrytoWidget.tsx src/pages/Dashboard.tsx src/pages/Settings.tsx
git commit -m "feat(DSKMT-003): router, Settings page, orientation support"
```
