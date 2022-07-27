import { useMemo } from 'react'
import { ResponsiveSunburst } from '@nivo/sunburst'
import {
  Card,
  Skeleton,
  useTheme,
  Typography,
  Box,
  IconButton,
} from '@mui/material'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { Fullscreen, FullscreenExit } from '@mui/icons-material'

import styles from '../../styles/Home.module.css'
import { CenteredSunburstMetric } from './CenteredMetric'
import { GroupedUserBalances } from '../../lib/types/delegate'
import { kFormatter } from '../../lib/helpers'
import getTheme from '../../lib/nivo/theme'
import { useDashboard } from '../../context/DashboardContext'

type Props = {
  title: string
  data: GroupedUserBalances | undefined
  customColors: string[]
}

const SunburstChart = ({ title, data, customColors }: Props): JSX.Element => {
  const theme = useTheme()
  const { setSelectedAddress, setSelectedDelegate } = useDashboard()
  const handle = useFullScreenHandle()

  return useMemo(() => {
    return (
      <FullScreen handle={handle} className={styles.chartCard}>
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
            </Typography>
            <IconButton onClick={handle.active ? handle.exit : handle.enter}>
              {handle.active ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Box>
          <Card className={styles.pieChartContainer}>
            {!data ? (
              <Skeleton
                variant='rectangular'
                height={'calc(100% - 1.7em)'}
                sx={{ mt: '1.7em' }}
                animation='wave'
              />
            ) : (
              <ResponsiveSunburst
                data={{
                  name: 'vote weights',
                  label: 'vote weights',
                  children: [
                    {
                      name: 'Recognized delegates',
                      label: 'Recognized delegates',
                      children: data.recognizedDelegates.map((usr) => ({
                        name: usr.address,
                        label: usr.name,
                        amount: usr.amount,
                      })),
                    },
                    {
                      name: 'Shadow delegates',
                      label: 'Shadow delegates',
                      children: data.shadowDelegates.map((usr) => ({
                        name: usr.address,
                        label: usr.address,
                        amount: usr.amount,
                      })),
                    },
                    {
                      name: 'Users',
                      label: 'Users',
                      children: data.users.map((usr) => ({
                        name: usr.address,
                        label: usr.address,
                        amount: usr.amount,
                      })),
                    },
                  ],
                }}
                id='name'
                value='amount'
                theme={{
                  ...getTheme(theme),
                  fontSize: handle.active ? 15 : 11,
                }}
                margin={{ top: 35, bottom: 10 }}
                borderWidth={1}
                borderColor={{ theme: 'background' }}
                colors={customColors}
                childColor={{ from: 'color', modifiers: [['brighter', 0.3]] }}
                enableArcLabels={true}
                arcLabelsSkipAngle={handle.active ? 5 : 10}
                arcLabelsTextColor={{
                  from: 'color',
                  modifiers: [['darker', 2.5]],
                }}
                tooltip={(datum) => (
                  <Card className={styles.chartTooltip}>
                    <span
                      className={styles.tooltipCircle}
                      style={{ backgroundColor: datum.color }}
                    ></span>
                    <span>
                      {datum.data.label.length === 42 &&
                      datum.data.label.startsWith('0x')
                        ? datum.data.label.slice(0, 12) +
                          '...' +
                          datum.data.label.slice(38)
                        : datum.data.label}
                      :{' '}
                      <b>
                        {kFormatter(datum.value, 2)} MKR |{' '}
                        {datum.formattedValue}
                      </b>
                    </span>
                  </Card>
                )}
                onClick={(slice) => {
                  if (slice.depth !== 2) return
                  if (slice.path[1] === 'Recognized delegates') {
                    const foundDelegate = data.recognizedDelegates.find(
                      (del) => del.address === slice.id
                    )
                    if (!foundDelegate) return
                    setSelectedAddress(foundDelegate.address)
                    setSelectedDelegate(foundDelegate.name)
                  } else {
                    setSelectedAddress(slice.id as string)
                    setSelectedDelegate(null)
                  }
                }}
                layers={['arcs', 'arcLabels', CenteredSunburstMetric]}
              />
            )}
          </Card>
        </Box>
      </FullScreen>
    )
    // eslint-disable-next-line
  }, [data, setSelectedAddress, setSelectedDelegate, theme, handle])
}

export default SunburstChart
