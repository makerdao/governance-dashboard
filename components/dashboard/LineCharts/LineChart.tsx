import { Dispatch, SetStateAction, useMemo } from 'react'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { Serie, ResponsiveLine } from '@nivo/line'
import {
  Card,
  Skeleton,
  useTheme,
  Typography,
  Box,
  IconButton,
} from '@mui/material'
import { Fullscreen, FullscreenExit } from '@mui/icons-material'

import InfoTooltip from '../InfoTooltip'
import styles from '../../../styles/Home.module.css'
import { kFormatter, kFormatterInt } from '../../../lib/helpers'
import getTheme from '../../../lib/nivo/theme'
import { mkrPalette, mkrPaletteMain } from '../../../lib/nivo/colors'
import { useDashboard } from '../../../context/DashboardContext'

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
  chartClass?: string
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
  chartClass,
}: Props): JSX.Element => {
  const { selectedStartDate, selectedEndDate } = useDashboard()
  const theme = useTheme()
  const handle = useFullScreenHandle()

  return useMemo(() => {
    const chartData = data?.map((serie) => ({
      ...serie,
      data: serie.data.filter(
        ({ x }) =>
          x &&
          (selectedStartDate ? x >= new Date(selectedStartDate) : true) &&
          (selectedEndDate ? x <= new Date(selectedEndDate) : true)
      ),
    }))

    return (
      <FullScreen handle={handle} className={chartClass || styles.chartCard}>
        <Box
          sx={{
            height: '100%',
            p: handle.active ? 2 : 0,
            bgcolor: handle.active
              ? (theme) => theme.palette.background.default
              : '',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              component='h3'
              variant='h6'
              gutterBottom
              sx={{ color: (theme) => theme.palette.text.primary }}
            >
              {title}
              {infoTooltipText ? <InfoTooltip text={infoTooltipText} /> : ''}
            </Typography>
            <IconButton onClick={handle.active ? handle.exit : handle.enter}>
              {handle.active ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Box>
          <Card className={styles.chartContainer}>
            {!chartData ? (
              <Skeleton
                variant='rectangular'
                height={'100%'}
                animation='wave'
              />
            ) : (
              <ResponsiveLine
                data={chartData}
                xScale={{
                  type: 'time',
                  format: '%Y-%m-%dT%H:%M:%SZ',
                }}
                yScale={{ type: 'linear', stacked }}
                xFormat='time:%b %d, %Y'
                yFormat={(value) => kFormatter(+value, 2)}
                margin={{
                  left: margin?.left || 60,
                  bottom: margin?.bottom || 45,
                  top: margin?.top || 5,
                  right: margin?.right || 80,
                }}
                theme={{
                  ...getTheme(theme),
                  fontSize: handle.active ? 15 : 11,
                }}
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
                  chartData.length === 1 || !enableLegend
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
          </Card>
        </Box>
      </FullScreen>
    )
    // eslint-disable-next-line
  }, [data, selectedStartDate, selectedEndDate, theme, handle])
}

export default LineChart
