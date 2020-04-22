export function cropAddress (string, reduceValue = 4) {
  if (string.length > 2 * reduceValue) {
    return `${string.slice(0, reduceValue)}…${string.slice(-reduceValue)}`
  } else {
    return string
  }
}
