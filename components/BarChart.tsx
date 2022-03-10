import { Card, Skeleton } from '@mui/material'
import { ResponsiveBar } from '@nivo/bar'

import styles from '../styles/Home.module.css'
import { PollVotersData } from '../lib/types/delegate'

type Props = {
  title: string
  data: PollVotersData[] | undefined
}

const BarChart = ({ title, data }: Props): JSX.Element => {
  return (
    <Card className={styles.chartCard}>
      <h3>{title}</h3>
      <div className={styles.chartContainer}>
        {!data ? (
          <Skeleton variant='rectangular' height={'100%'} animation='wave' />
        ) : (
          <ResponsiveBar
            data={data}
            colors='#f4b62f'
            keys={['uniqueVoters']}
            indexBy='month'
            margin={{ left: 60, bottom: 40, top: 5, right: 50 }}
            padding={0.2}
            theme={{
              axis: {
                legend: {
                  text: {
                    fontWeight: 'bold',
                  },
                },
              },
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
              <div className={styles.chartTooltip}>
                <span
                  className={styles.tooltipCircle}
                  style={{ backgroundColor: color }}
                ></span>
                <span>
                  {data.month}: <b>{data.uniqueVoters}</b> voters
                </span>
              </div>
            )}
          />
        )}
      </div>
    </Card>
  )
}

export default BarChart
