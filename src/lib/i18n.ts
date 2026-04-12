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
        wmo: {
            0: 'Sereno',
            1: 'Prevalentemente sereno',
            2: 'Parzialmente nuvoloso',
            3: 'Nuvoloso',
            45: 'Nebbia',
            48: 'Nebbia ghiacciata',
            51: 'Pioggerella leggera',
            53: 'Pioggerella moderata',
            61: 'Pioggia leggera',
            63: 'Pioggia moderata',
            71: 'Neve leggera',
            80: 'Rovesci leggeri',
            95: 'Temporale',
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
        wmo: {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Icy fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            61: 'Light rain',
            63: 'Moderate rain',
            71: 'Light snow',
            80: 'Light showers',
            95: 'Thunderstorm',
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
        wmo: {
            0: '晴天',
            1: '基本晴朗',
            2: '局部多云',
            3: '阴天',
            45: '雾',
            48: '冻雾',
            51: '小毛毛雨',
            53: '中等毛毛雨',
            61: '小雨',
            63: '中雨',
            71: '小雪',
            80: '小阵雨',
            95: '雷暴',
        } as Record<number, string>,
    },
} as const

export type Translations = typeof translations.it
export { translations }