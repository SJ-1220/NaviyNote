export const formatDate = (d: Date) => d.toISOString().split('T')[0]

export const todayDateFormat = () => {
  const today = new Date()
  return formatDate(today)
}
