import { Datum, ResponsiveLine } from '@nivo/line'
import { Card, Skeleton } from '@mui/material'

import styles from '../styles/Home.module.css'
import { kFormatter, kFormatterInt } from '../lib/helpers'

type Props = {
  datasetOne: Datum[] | undefined
  datasetTwo?: Datum[] | undefined
  datasetOneId: string
  datasetTwoId?: string
  legendX: string
  legendY: string
  title: string
  enableArea?: boolean
}

const LineChart = ({
  datasetOne,
  datasetTwo = [],
  datasetOneId,
  datasetTwoId = '',
  legendX,
  legendY,
  title,
  enableArea = false,
}: Props): JSX.Element => {
  return (
    <Card className={styles.chartCard}>
      <h3>{title}</h3>
      <div className={styles.chartContainer}>
        {!datasetOne || !datasetTwo ? (
          <Skeleton variant='rectangular' height={'100%'} animation='wave' />
        ) : (
          <ResponsiveLine
            data={[
              {
                id: datasetOneId,
                color: 'hsl(173, 74%, 39%)',
                data: datasetOne,
              },
              {
                id: datasetTwoId,
                color: 'hsl(41, 90%, 57%)',
                data: datasetTwo || [],
              },
            ]}
            xScale={{
              type: 'time',
              format: '%Y-%m-%dT%H:%M:%SZ',
            }}
            xFormat='time:%b %d, %Y'
            yFormat={(value) => kFormatter(+value).toString()}
            margin={{ left: 67, bottom: 40, top: 5, right: 80 }}
            theme={{
              axis: {
                legend: {
                  text: {
                    fontWeight: 'bold',
                  },
                },
              },
            }}
            colors={{ datum: 'color' }}
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
            tooltip={({ point }) => (
              <div className={styles.chartTooltip}>
                <span
                  className={styles.tooltipCircle}
                  style={{ backgroundColor: point.color }}
                ></span>
                <span>
                  {point.data.xFormatted}: <b>{point.data.yFormatted}</b>
                </span>
              </div>
            )}
            legends={
              !datasetTwo.length
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
          />
        )}
      </div>
    </Card>
  )
}

export default LineChart
