import { PieCustomLayerProps } from '@nivo/pie'
import { SunburstCustomLayerProps } from '@nivo/sunburst'
import { useTheme } from '@mui/material'

import { kFormatter } from '../../lib/helpers'

interface RawSunburstDatum {
  name: string
  children: {
    name: string
    children: {
      name: string
      amount: number
    }[]
  }[]
}

interface RawPieDatum {
  id: string
  value: number
}

type CenteredMetricProps = {
  total: string | number
  centerX: number
  centerY: number
  fontSize: number
}

const CenteredMetric = ({
  total,
  centerX,
  centerY,
  fontSize,
}: CenteredMetricProps) => {
  const theme = useTheme()

  return (
    <text
      x={centerX}
      y={centerY}
      textAnchor='middle'
      dominantBaseline='central'
      style={{
        fontSize: Math.round(fontSize) + 'px',
        fontWeight: 500,
        fill: theme.palette.text.primary,
      }}
    >
      {total}
    </text>
  )
}

export const CenteredPieMetric = ({
  dataWithArc,
  centerX,
  centerY,
  innerRadius,
}: PieCustomLayerProps<RawPieDatum>) => {
  const total = kFormatter(
    dataWithArc.reduce((acum, datum) => acum + datum.value, 0),
    2
  )

  return (
    <CenteredMetric
      total={total}
      centerX={centerX}
      centerY={centerY}
      fontSize={(innerRadius < 100 ? 0.45 : 0.3) * innerRadius}
    />
  )
}

export const CenteredSunburstMetric = ({
  nodes,
  centerX,
  centerY,
  radius,
}: SunburstCustomLayerProps<RawSunburstDatum>) => {
  const total = kFormatter(
    nodes.reduce(
      (acum, datum) => (datum.depth === 1 ? acum + datum.value : acum),
      0
    ),
    2
  )

  return (
    <CenteredMetric
      total={total}
      centerX={centerX}
      centerY={centerY}
      fontSize={(radius < 200 ? 0.26 : 0.175) * radius}
    />
  )
}
