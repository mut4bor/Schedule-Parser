export const numberToTime = (number: number): string => {
  const hours = Math.floor(number * 24)
  const minutes = Math.round((number * 24 - hours) * 60)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}
