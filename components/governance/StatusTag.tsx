import styles from '../../styles/Home.module.css'

enum ActivityStatus {
  Pending = 'Pending',
  Active = 'Active',
  Archived = 'Archived',
}

type Props = {
  status: ActivityStatus
}

const StatusTag = ({ status }: Props) => {
  return (
    <span className={styles[status.toLowerCase() + 'Tag']}>
      {status || 'Active'}
    </span>
  )
}

export default StatusTag
