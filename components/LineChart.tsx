import { Dispatch, SetStateAction } from 'react'
import { Serie, ResponsiveLine } from '@nivo/line'
import { Card, Skeleton } from '@mui/material'

import styles from '../styles/Home.module.css'
import { kFormatter, kFormatterInt } from '../lib/helpers'

type Props = {
  data: Serie[] | undefined
  legendX: string
  legendY: string
  title: string
  enableArea?: boolean
  stacked?: boolean
  mkrColors?: boolean
  enableSlices?: boolean
  enableClick?: boolean
  clickFunction?: Dispatch<SetStateAction<number | null>>
  margin?: { top?: number; right?: number; bottom?: number; left?: number }
  enableLegend?: boolean
}

const LineChart = ({
  data,
  legendX,
  legendY,
  title,
  enableArea = false,
  stacked = false,
  mkrColors = true,
  enableSlices = false,
  enableClick = false,
  clickFunction,
  margin,
  enableLegend = true,
}: Props): JSX.Element => {
  return (
    <Card className={styles.chartCard}>
      <h3>{title}</h3>
      <div className={styles.chartContainer}>
        {!data ? (
          <Skeleton variant='rectangular' height={'100%'} animation='wave' />
        ) : (
          <ResponsiveLine
            data={data}
            xScale={{
              type: 'time',
              format: '%Y-%m-%dT%H:%M:%SZ',
            }}
            yScale={{ type: 'linear', stacked }}
            xFormat='time:%b %d, %Y'
            yFormat={(value) => kFormatter(+value, 2)}
            margin={{
              left: margin?.left || 67,
              bottom: margin?.bottom || 40,
              top: margin?.top || 5,
              right: margin?.right || 80,
            }}
            theme={{
              axis: {
                legend: {
                  text: {
                    fontWeight: 'bold',
                  },
                },
              },
            }}
            colors={
              mkrColors
                ? ['hsl(173, 74%, 39%)', 'hsl(41, 90%, 57%)']
                : { scheme: 'nivo' }
            }
            enablePoints={false}
            enableGridX={false}
            axisLeft={{
              legend: legendY,
              legendOffset: -50,
              legendPosition: 'middle',
              format: (value) => kFormatterInt(value),
            }}
            axisBottom={{
              legend: legendX,
              legendOffset: 36,
              legendPosition: 'middle',
              tickValues: 'every 3 months',
              format: '%b %d, %Y',
            }}
            isInteractive={true}
            useMesh={true}
            tooltip={({ point }) => {
              return (
                <div className={styles.chartTooltip}>
                  <span
                    className={styles.tooltipCircle}
                    style={{ backgroundColor: point.color }}
                  ></span>
                  <span>
                    {point.data.xFormatted}: <b>{point.data.yFormatted}</b>
                  </span>
                </div>
              )
            }}
            legends={
              data.length === 1 || !enableLegend
                ? []
                : [
                    {
                      anchor: 'right',
                      direction: 'column',
                      itemWidth: 80,
                      itemHeight: 20,
                      translateX: 90,
                      symbolSize: 10,
                      symbolShape: 'circle',
                    },
                  ]
            }
            enableArea={enableArea}
            areaOpacity={stacked ? 1 : 0.2}
            enableSlices={enableSlices && 'x'}
            onClick={(point) => {
              if (!enableClick) return
              const newVal = new Date(point.data.x).getTime()
              if (clickFunction) clickFunction(newVal)
            }}
          />
        )}
      </div>
    </Card>
  )
}

export default LineChart
