export const getFilterParams = (req) => {
  if (Object.keys(req.query).length === 0) {
    return {}
  }

  return Object.keys(req.query).reduce((filter, key) => {
    filter[key] = req.query[key]
    return filter
  }, {})
}
