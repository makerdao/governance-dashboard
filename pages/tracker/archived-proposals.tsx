import { useEffect } from 'react'

import ProposalsTable from '../../components/governance/ProposalsTable'
import { useTracker } from '../../context/TrackerContext'

const ArchivedProposals = () => {
  const { archivedProposals, setFetchArchive } = useTracker()

  useEffect(() => {
    if (!archivedProposals) setFetchArchive(true)
    // eslint-disable-next-line
  }, [])

  return (
    <ProposalsTable
      title='Archived proposals'
      proposals={archivedProposals}
      archiveTable
    />
  )
}

export default ArchivedProposals
