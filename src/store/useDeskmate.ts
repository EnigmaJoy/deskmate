import { create } from 'zustand'
import type { Locale } from '../lib/i18n'

interface DeskmateStore {
    locale: Locale
    brightness: number
    volume: number
    setLocale: (l: Locale) => void
    setBrightness: (v: number) => void
    setVolume: (v: number) => void
}

export const useDeskmate = create<DeskmateStore>((set) => ({
    locale: 'it',
    brightness: 85,
    volume: 60,
    setLocale: (locale) => set({ locale }),
    setBrightness: (brightness) => set({ brightness }),
    setVolume: (volume) => set({ volume }),
}))