import { ResponsivePie } from '@nivo/pie'
import { Card, Skeleton } from '@mui/material'

import styles from '../styles/Home.module.css'
import { CenteredPieMetric } from './CenteredMetric'
import { kFormatter } from '../lib/helpers'

type Props = {
  title: string
  data: { id: string; value: number }[] | undefined
}

const PieChart = ({ title, data }: Props): JSX.Element => {
  return (
    <Card className={styles.chartCard}>
      <h3>{title}</h3>
      <div className={styles.chartContainer}>
        {!data ? (
          <Skeleton variant='rectangular' height={'100%'} animation='wave' />
        ) : (
          <ResponsivePie
            data={data}
            valueFormat={(value) => kFormatter(+value, 2)}
            margin={{ top: 30, bottom: 30 }}
            innerRadius={0.6}
            cornerRadius={3}
            sortByValue={true}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 0.2]],
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor='#333333'
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={15}
            arcLinkLabel={(datum) =>
              datum.data.id.length === 42 && datum.data.id.startsWith('0x')
                ? datum.data.id.slice(0, 12) + '...' + datum.data.id.slice(38)
                : datum.data.id
            }
            tooltip={(datum) => {
              console.log(datum)
              return (
                <div className={styles.chartTooltip}>
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
                      {((datum.datum.arc.angle * 100) / (Math.PI * 2)).toFixed(
                        2
                      )}{' '}
                      %
                    </b>
                  </span>
                </div>
              )
            }}
            layers={[
              'arcLinkLabels',
              'arcs',
              'arcLabels',
              'legends',
              CenteredPieMetric,
            ]}
          />
        )}
      </div>
    </Card>
  )
}

export default PieChart
