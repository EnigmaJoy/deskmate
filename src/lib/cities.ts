export interface City {
    name: string
    lat: number
    lon: number
}

export const CITIES: City[] = [
    { name: 'Padova', lat: 45.4064, lon: 11.8768 },
    { name: 'Milano', lat: 45.4654, lon:  9.1859 },
    { name: 'Roma',   lat: 41.9028, lon: 12.4964 },
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
    { name: 'Tokyo',  lat: 35.6762, lon: 139.6503 },
]
