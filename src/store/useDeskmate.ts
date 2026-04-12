import { create } from 'zustand'
import type { Locale } from '../lib/i18n'

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
    setLocale: (l: Locale) => void
    setBrightness: (v: number) => void
    setVolume: (v: number) => void
    setLocation: (l: Location) => void
    setDistanceThreshold: (cm: number) => void
}

export const useDeskmate = create<DeskmateStore>((set) => ({
    locale: 'it',
    brightness: 85,
    volume: 60,
    location: { name: 'Padova', lat: 45.4064, lon: 11.8768 },
    distanceThreshold: 100,
    setLocale: (locale) => set({ locale }),
    setBrightness: (brightness) => set({ brightness }),
    setVolume: (volume) => set({ volume }),
    setLocation: (location) => set({ location }),
    setDistanceThreshold: (distanceThreshold) => set({ distanceThreshold }),
}))