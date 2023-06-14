import { useMemo } from 'react'
import { Card, CardContent, Skeleton, Typography } from '@mui/material'

import styles from '../../styles/Home.module.css'
import { useDashboard } from '../../context/DashboardContext'
import { DelegateBalance } from '../../lib/types/delegate'
import { reduceAndFormatDelegations, reduceDelegators } from '../../lib/helpers'

type Props = {
  title: string
  type: 'delegates-count' | 'delegators-count' | 'mkr-delegated'
  data: DelegateBalance[] | undefined
}

const DataCard = ({ data, type, title }: Props): JSX.Element => {
  const { showExpiredDelegates } = useDashboard()
  return useMemo(() => {
    const cardData = data && [
      {
        name: 'Aligned',
        delegates: data.filter((delegate) =>
          showExpiredDelegates
            ? delegate.status === 'aligned' ||
              (delegate.expired === true && delegate.name)
            : delegate.status === 'aligned'
        ),
      },
      {
        name: 'Shadow',
        delegates: data.filter((delegate) =>
          showExpiredDelegates
            ? delegate.status === 'shadow' ||
              (delegate.expired === true && !delegate.name)
            : delegate.status === 'shadow'
        ),
      },
      {
        name: 'Total',
        delegates: data.filter((delegate) =>
          showExpiredDelegates ? true : delegate.status !== 'expired'
        ),
      },
    ]

    return (
      <div className={styles.infoCard}>
        <Typography
          component='h3'
          variant='h6'
          gutterBottom
          sx={{ color: (theme) => theme.palette.text.primary }}
        >
          {title}
        </Typography>
        <Card sx={{ height: 'calc(100% - 39px)' }}>
          <CardContent style={{ padding: '0.8em', height: '100%' }}>
            <div className={styles.infoCardContainer}>
              {!cardData
                ? Array.from(Array(3).keys()).map((key) => (
                    <div
                      key={key}
                      className={styles.thirdWidth}
                      style={{ padding: '0 0.2em' }}
                    >
                      <Skeleton animation='wave' height={60} />
                    </div>
                  ))
                : cardData.map(({ name, delegates }, index) => (
                    <div key={index} className={styles.thirdWidth}>
                      <p className={styles.infoCardValue}>
                        {type === 'delegates-count'
                          ? delegates.reduce(
                              (acum, current) =>
                                acum.add(current.name || current.voteDelegate),
                              new Set()
                            ).size
                          : type === 'delegators-count'
                          ? reduceDelegators(delegates)
                          : reduceAndFormatDelegations(delegates)}
                      </p>
                      <p className={styles.infoCardLabel}>{name}</p>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
    // eslint-disable-next-line
  }, [showExpiredDelegates, data])
}

export default DataCard
