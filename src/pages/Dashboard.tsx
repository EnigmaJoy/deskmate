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
