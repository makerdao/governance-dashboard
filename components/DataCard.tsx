import { Card, Skeleton } from '@mui/material'

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
    <Card className={styles.infoCard}>
      <h3>{title}</h3>
      {!data ? (
        <>
          <Skeleton animation='wave' height={80} />
        </>
      ) : (
        <div className={styles.infoCardContainer}>
          {data.map(({ name, value }, index) => (
            <div key={index} className={styles.thirdWidth}>
              <p className={styles.infoCardValue}> {value}</p>
              <p className={styles.infoCardLabel}>{name}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default DataCard
