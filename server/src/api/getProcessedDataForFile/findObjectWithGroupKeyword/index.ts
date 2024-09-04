export const findObjectWithGroupKeyword = (objects: Record<string, string | number | boolean | null>[]) => {
  return (
    objects.find((obj) =>
      Object.values(obj).some(
        (value) =>
          (typeof value === 'string' && (value.includes('Группа') || value.match(/^\d{3}$/))) ||
          (typeof value === 'number' && value.toString().match(/^\d{3}$/)),
      ),
    ) || null
  )
}
