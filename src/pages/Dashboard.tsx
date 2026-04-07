import SensorsWidget from "../components/SensorWidget.tsx";
import WeatherWidget from "../components/WeatherWidget.tsx";
import CryptoWidget from "../components/CrytoWidget.tsx";
import StatusWidget from "../components/StatusWidget.tsx";

export default function Dashboard() {
    return (
        <div className="w-full bg-[#1c1c1e] p-5 grid gap-3"
             style={{ width: '800px', height: '480px', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr' }}>

            <SensorsWidget />
            <WeatherWidget />
            <CryptoWidget />
            <StatusWidget />

        </div>
    )
}