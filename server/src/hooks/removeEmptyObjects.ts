export const removeEmptyObjects = (obj: { [key: string]: any }) => {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      removeEmptyObjects(obj[key])

      if (Object.keys(obj[key]).length === 0) {
        delete obj[key]
      }
    }
  }
}
