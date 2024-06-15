import { useSwipeable } from 'react-swipeable'

export const createTapStopPropagationHandler = () =>
  useSwipeable({
    onTap: (event) => {
      event.event.stopPropagation()
    },
  })
