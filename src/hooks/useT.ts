import { translations } from '../lib/i18n'
import type { Translations } from '../lib/i18n'
import { useDeskmate } from '../store/useDeskmate'

export function useT(): Translations {
    const locale = useDeskmate(s => s.locale)
    return translations[locale] as unknown as Translations
}