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
import { PollVotersData } from '../../lib/types/delegate'
import getTheme from '../../lib/nivo/theme'

type Props = {
  title: string
  data: PollVotersData[] | undefined
}

const BarChart = ({ title, data }: Props): JSX.Element => {
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
            {title}
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
              colors='hsl(41, 90%, 57%)'
              keys={['uniqueVoters']}
              indexBy='month'
              margin={{ left: 60, bottom: 45, top: 5, right: 50 }}
              padding={0.2}
              theme={{
                ...getTheme(theme),
                fontSize: handle.active ? 15 : 11,
              }}
              axisLeft={{
                legend: 'Voters',
                legendOffset: -50,
                legendPosition: 'middle',
                format: '.2s',
              }}
              axisBottom={{
                legend: 'Month',
                legendOffset: 36,
                legendPosition: 'middle',
                tickValues: data
                  .filter((entry, i) => i % 4 === 0)
                  .map((entry) => entry.month),
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
                    {data.month}: <b>{data.uniqueVoters}</b> voters
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

export default BarChart
