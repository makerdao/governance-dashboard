import { Theme as MaterialTheme } from '@mui/material'
import { Theme as NivoTheme } from '@nivo/core'

const getTheme = ({ palette }: MaterialTheme): NivoTheme => ({
  background: palette.mode === 'light' ? '#FFFFFF' : '#1E1E1E',
  axis: {
    legend: {
      text: {
        fontWeight: 'bold',
        fill: palette.text.primary,
      },
    },
    ticks: {
      line: { stroke: palette.text.primary },
      text: { fill: palette.text.primary },
    },
  },
  grid: {
    line: { stroke: palette.divider },
  },
  legends: {
    text: { fill: palette.text.primary },
  },
  tooltip: {
    container: {
      background: palette.background.paper,
      color: palette.text.primary,
    },
  },
})

export default getTheme
