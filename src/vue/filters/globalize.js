import { i18n } from '@/i18n'

export function globalize (translationId, interpolationOps = {}) {
  interpolationOps.interpolation = { escapeValue: false }
  return i18n.t(translationId, interpolationOps)
}
