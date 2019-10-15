import { globalize } from './globalize'

export function formatToPercent (value) {
  return globalize('formats.percent', { value })
}
