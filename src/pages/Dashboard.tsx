import React from 'react'
import SensorsWidget from "../components/SensorWidget.tsx"
import WeatherWidget from "../components/WeatherWidget.tsx"
import CryptoWidget from "../components/CrytoWidget.tsx"
import StatusWidget from "../components/StatusWidget.tsx"
import { useDeskmate } from '../store/useDeskmate'
import type { Page } from '../types'

interface DashboardProps {
    navigate: (page: Page) => void
}

export default function Dashboard({ navigate }: DashboardProps) {
    const orientation = useDeskmate(s => s.orientation)

    if (orientation === 'portrait') {
        const cell: React.CSSProperties = { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }
        return (
            <div style={{
                width: '480px',
                height: '800px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '20px',
                background: '#1c1c1e',
                boxSizing: 'border-box',
            }}>
                <div style={cell}><SensorsWidget portrait /></div>
                <div style={cell}><WeatherWidget portrait /></div>
                <div style={cell}><CryptoWidget portrait /></div>
                <div style={cell}><StatusWidget navigate={navigate} portrait /></div>
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
