export const findObjectWithGroupKeyword = (objects: Record<string, string | number | boolean | null>[]) => {
  for (let obj of objects) {
    for (let value of Object.values(obj)) {
      if (
        (typeof value === 'string' && (value.includes('Группа') || value.match(/^\d{3}$/))) ||
        (typeof value === 'number' && value.toString().match(/^\d{3}$/))
      ) {
        return obj
      }
    }
  }
  return null
}
