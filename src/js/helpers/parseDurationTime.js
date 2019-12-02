const MINUTES_IN_DAY = 1440
const MINUTES_IN_HOUR = 60

export function parseDurationTime (strTime) {
  let totalMinutes = 0
  let days = strTime.match(/(\d+)\s*d/)
  let hours = strTime.match(/(\d+)\s*h/)
  let minutes = strTime.match(/(\d+)\s*m/)
  if (days) { totalMinutes += parseInt(days[1]) * MINUTES_IN_DAY }
  if (hours) { totalMinutes += parseInt(hours[1]) * MINUTES_IN_HOUR }
  if (minutes) { totalMinutes += parseInt(minutes[1]) }
  return totalMinutes
}
