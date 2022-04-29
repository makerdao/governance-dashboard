import styles from '../../styles/Home.module.css'

type Props = {
  status: string
}

const ArchivedStatusTag = ({ status }: Props) => {
  const className =
    status === 'Concluded - Successful'
      ? styles.successfulArchivedTag
      : status === 'Concluded - Unsuccessful'
      ? styles.unsuccessfulArchivedTag
      : styles.archivedTag

  return (
    <div className={className}>
      <span>{status}</span>
    </div>
  )
}

export default ArchivedStatusTag
