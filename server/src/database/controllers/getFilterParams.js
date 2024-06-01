export const getFilterParams = (req) => {
  const filter = {}

  if (Object.keys(req.query).length !== 0) {
    for (const key in req.query) {
      if (Object.hasOwnProperty.call(req.query, key)) {
        filter[key] = req.query[key]
      }
    }
  }
  return filter
}
