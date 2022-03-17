import { PieCustomLayerProps } from '@nivo/pie'
import { SunburstCustomLayerProps } from '@nivo/sunburst'

import { kFormatter } from '../lib/helpers'

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
}

const CenteredMetric = ({ total, centerX, centerY }: CenteredMetricProps) => {
  return (
    <text
      x={centerX}
      y={centerY}
      textAnchor='middle'
      dominantBaseline='central'
      style={{
        fontSize: '40px',
        fontWeight: 500,
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
}: PieCustomLayerProps<RawPieDatum>) => {
  const total = kFormatter(
    dataWithArc.reduce((acum, datum) => acum + datum.value, 0),
    2
  )

  return <CenteredMetric total={total} centerX={centerX} centerY={centerY} />
}

export const CenteredSunburstMetric = ({
  nodes,
  centerX,
  centerY,
}: SunburstCustomLayerProps<RawSunburstDatum>) => {
  const total = kFormatter(
    nodes.reduce(
      (acum, datum) => (datum.depth === 1 ? acum + datum.value : acum),
      0
    ),
    2
  )

  return <CenteredMetric total={total} centerX={centerX} centerY={centerY} />
}
