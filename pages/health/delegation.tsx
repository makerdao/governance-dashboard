import {
  Card,
  Skeleton,
  useTheme,
  Typography,
  Box,
  IconButton,
} from '@mui/material'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { ResponsiveBar } from '@nivo/bar'
import { Fullscreen, FullscreenExit } from '@mui/icons-material'

import styles from '../../styles/Home.module.css'
import getTheme from '../../lib/nivo/theme'

const data = [
  {
    quarter: 'Q3 2021',
    delegatesAmount: 5,
  },
  {
    quarter: 'Q4 2021',
    delegatesAmount: 7.67,
  },
  {
    quarter: 'Q1 2022',
    delegatesAmount: 10.67,
  },
  {
    quarter: 'Q2 2022',
    delegatesAmount: 16.33,
  },
  {
    quarter: 'Q3 2022',
    delegatesAmount: 22.33,
  },
]

const BarChart = (): JSX.Element => {
  const theme = useTheme()
  const handle = useFullScreenHandle()

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
            Delegates Inflow
          </Typography>
          <IconButton onClick={handle.active ? handle.exit : handle.enter}>
            {handle.active ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Box>
        <Card className={styles.chartContainer}>
          {!data ? (
            <Skeleton variant='rectangular' height={'100%'} animation='wave' />
          ) : (
            <ResponsiveBar
              data={data}
              colors='#1aab9b'
              keys={['delegatesAmount']}
              indexBy='quarter'
              margin={{ left: 60, bottom: 45, top: 5, right: 50 }}
              padding={0.2}
              theme={{
                ...getTheme(theme),
                fontSize: handle.active ? 15 : 11,
              }}
              axisLeft={{
                legend: 'Delegates',
                legendOffset: -50,
                legendPosition: 'middle',
              }}
              axisBottom={{
                legend: 'Quarter',
                legendOffset: 36,
                legendPosition: 'middle',
              }}
              isInteractive={true}
              enableLabel={false}
              tooltip={({ data, color }) => (
                <Card className={styles.chartTooltip}>
                  <span
                    className={styles.tooltipCircle}
                    style={{ backgroundColor: color }}
                  ></span>
                  <span>
                    {data.quarter}: <b>{data.delegatesAmount}</b> delegates
                  </span>
                </Card>
              )}
            />
          )}
        </Card>
      </Box>
    </FullScreen>
  )
}

const DelegationHealth = () => {
  return (
    <>
      <BarChart />
    </>
  )
}

export default DelegationHealth
