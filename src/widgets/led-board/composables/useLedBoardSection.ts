import { LED_CELL_COUNT, LED_COLS, LED_ROWS } from '../lib/led-grid'

export const useLedBoardSection = () => {
  const { n } = useI18n()

  const cellCount = computed(() => n(LED_CELL_COUNT))
  const placeholderStyle = { aspectRatio: `${LED_COLS} / ${LED_ROWS}` }

  return { cellCount, placeholderStyle }
}
