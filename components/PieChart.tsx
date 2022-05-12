import { Dispatch, SetStateAction } from 'react'
import { ResponsivePie } from '@nivo/pie'
import {
  Card,
  Skeleton,
  useTheme,
  Typography,
  Button,
  Box,
} from '@mui/material'

import InfoTooltip from './InfoTooltip'
import styles from '../styles/Home.module.css'
import { CenteredPieMetric } from './CenteredMetric'
import { kFormatter } from '../lib/helpers'
import getTheme from '../lib/nivo/theme'
import { mkrPalette } from '../lib/nivo/colors'

type Props = {
  title: string
  data: { id: string; value: number }[] | undefined
  infoTooltipText?: string
  backToNow: boolean
  setSelectedTime: Dispatch<SetStateAction<number | null>>
}

const PieChart = ({
  title,
  data,
  infoTooltipText,
  backToNow,
  setSelectedTime,
}: Props): JSX.Element => {
  const theme = useTheme()

  return (
    <div className={styles.chartCard}>
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
          {title}{' '}
          {infoTooltipText ? <InfoTooltip text={infoTooltipText} /> : ''}
        </Typography>
        {backToNow && (
          <Button
            size='small'
            variant='outlined'
            sx={{ py: 0 }}
            onClick={() => setSelectedTime(null)}
          >
            Back to Now
          </Button>
        )}
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
          <ResponsivePie
            data={data}
            valueFormat={(value) => kFormatter(+value, 2)}
            margin={{ top: 40, bottom: 25 }}
            innerRadius={0.6}
            cornerRadius={3}
            sortByValue={true}
            activeOuterRadiusOffset={6}
            activeInnerRadiusOffset={2}
            borderWidth={1.5}
            borderColor={{ theme: 'background' }}
            theme={getTheme(theme)}
            colors={mkrPalette}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor={theme.palette.text.primary}
            arcLinkLabelsThickness={2}
            arcLinkLabelsStraightLength={36}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={15}
            arcLinkLabel={(datum) =>
              datum.data.id.length === 42 && datum.data.id.startsWith('0x')
                ? datum.data.id.slice(0, 12) + '...' + datum.data.id.slice(38)
                : datum.data.id
            }
            tooltip={(datum) => (
              <Card className={styles.chartTooltip}>
                <span
                  className={styles.tooltipCircle}
                  style={{ backgroundColor: datum.datum.color }}
                ></span>
                <span>
                  {datum.datum.data.id.length === 42 &&
                  datum.datum.data.id.startsWith('0x')
                    ? datum.datum.data.id.slice(0, 12) +
                      '...' +
                      datum.datum.data.id.slice(38)
                    : datum.datum.data.id}
                  :{' '}
                  <b>
                    {datum.datum.formattedValue} MKR |{' '}
                    {((datum.datum.arc.angle * 100) / (Math.PI * 2)).toFixed(2)}{' '}
                    %
                  </b>
                </span>
              </Card>
            )}
            layers={[
              'arcLinkLabels',
              'arcs',
              'arcLabels',
              'legends',
              CenteredPieMetric,
            ]}
          />
        )}
      </Card>
    </div>
  )
}

export default PieChart
