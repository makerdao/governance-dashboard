import { Card, CardContent, Skeleton, Typography } from '@mui/material'

import styles from '../styles/Home.module.css'

type DataEntry = {
  name: string
  value: number | string
}

type Props = {
  title: string
  data: DataEntry[] | undefined
}

const DataCard = ({ data, title }: Props): JSX.Element => {
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
            {!data
              ? Array.from(Array(3).keys()).map((key) => (
                  <div
                    key={key}
                    className={styles.thirdWidth}
                    style={{ padding: '0 0.2em' }}
                  >
                    <Skeleton animation='wave' height={60} />
                  </div>
                ))
              : data.map(({ name, value }, index) => (
                  <div key={index} className={styles.thirdWidth}>
                    <p className={styles.infoCardValue}> {value}</p>
                    <p className={styles.infoCardLabel}>{name}</p>
                  </div>
                ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DataCard
