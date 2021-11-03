import dayjs from "dayjs"
import 'dayjs/locale/es'

export const getWeekId = () => {
  const monday = dayjs().startOf('week').add(1, 'day') // EN locale starts with Sunday
  return monday.format('YYYY-MM-DD')
}