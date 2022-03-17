import { Dispatch, SetStateAction } from 'react'
import { ResponsiveSunburst } from '@nivo/sunburst'
import { Card, Skeleton } from '@mui/material'

import styles from '../styles/Home.module.css'
import { CenteredSunburstMetric } from './CenteredMetric'
import { GroupedUserBalances } from '../lib/types/delegate'
import { kFormatter } from '../lib/helpers'

type Props = {
  title: string
  data: GroupedUserBalances | undefined
  customColors: string[]
  setSelectedAddress: Dispatch<SetStateAction<string | null>>
  setSelectedDelegate: Dispatch<SetStateAction<string | null>>
}

const SunburstChart = ({
  title,
  data,
  customColors,
  setSelectedAddress,
  setSelectedDelegate,
}: Props): JSX.Element => {
  return (
    <Card className={styles.chartCard}>
      <h3>{title}</h3>
      <div className={styles.chartContainer}>
        {!data ? (
          <Skeleton variant='rectangular' height={'100%'} animation='wave' />
        ) : (
          <ResponsiveSunburst
            data={{
              name: 'vote weights',
              children: [
                {
                  name: 'Recognized delegates',
                  children: data.recognizedDelegates.map((usr) => ({
                    name: usr.name,
                    amount: usr.amount,
                  })),
                },
                {
                  name: 'Shadow delegates',
                  children: data.shadowDelegates.map((usr) => ({
                    name: usr.address,
                    amount: usr.amount,
                  })),
                },
                {
                  name: 'Users',
                  children: data.users.map((usr) => ({
                    name: usr.address,
                    amount: usr.amount,
                  })),
                },
              ],
            }}
            id='name'
            value='amount'
            borderWidth={1}
            colors={customColors}
            childColor={{ from: 'color', modifiers: [['brighter', 0.3]] }}
            enableArcLabels={true}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: 'color',
              modifiers: [['darker', 1.5]],
            }}
            tooltip={(datum) => (
              <div className={styles.chartTooltip}>
                <span
                  className={styles.tooltipCircle}
                  style={{ backgroundColor: datum.color }}
                ></span>
                <span>
                  {datum.data.name.length === 42 &&
                  datum.data.name.startsWith('0x')
                    ? datum.data.name.slice(0, 12) +
                      '...' +
                      datum.data.name.slice(38)
                    : datum.data.name}
                  :{' '}
                  <b>
                    {kFormatter(datum.value, 2)} MKR | {datum.formattedValue}
                  </b>
                </span>
              </div>
            )}
            onClick={(slice) => {
              if (slice.depth !== 2) return
              if (slice.path[1] === 'Recognized delegates') {
                const foundDelegate = data.recognizedDelegates.find(
                  (del) => del.name === slice.id
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
      </div>
    </Card>
  )
}

export default SunburstChart
