import { Dispatch, SetStateAction } from 'react'
import { Serie, ResponsiveLine } from '@nivo/line'
import { Card, Skeleton, useTheme } from '@mui/material'

import InfoTooltip from './InfoTooltip'
import styles from '../styles/Home.module.css'
import { kFormatter, kFormatterInt } from '../lib/helpers'
import getTheme from '../lib/nivo/theme'
import { mkrPalette, mkrPaletteMain } from '../lib/nivo/colors'

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
  infoTooltipText?: string
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
  infoTooltipText,
}: Props): JSX.Element => {
  const theme = useTheme()

  return (
    <Card className={styles.chartCard}>
      <h3>
        {title} {infoTooltipText ? <InfoTooltip text={infoTooltipText} /> : ''}
      </h3>
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
            theme={getTheme(theme)}
            colors={mkrColors ? mkrPaletteMain : mkrPalette}
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
                <Card className={styles.chartTooltip}>
                  <span
                    className={styles.tooltipCircle}
                    style={{ backgroundColor: point.color }}
                  ></span>
                  <span>
                    {point.data.xFormatted}: <b>{point.data.yFormatted}</b>
                  </span>
                </Card>
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
            areaOpacity={0.05}
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
