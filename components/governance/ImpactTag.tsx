import styles from '../../styles/Home.module.css'

enum Impact {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

type Props = {
  impact: Impact
}

const ImpactTag = ({ impact }: Props) => {
  return (
    <span className={styles[impact.toLocaleLowerCase() + 'ImpactTag']}>
      {impact}
    </span>
  )
}

export default ImpactTag
