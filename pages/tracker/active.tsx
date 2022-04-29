import ProposalsTable from '../../components/governance/ProposalsTable'
import { useTracker } from '../../context/TrackerContext'

const ActiveProposals = () => {
  const { activeProposals } = useTracker()

  return (
    <ProposalsTable
      title='Active proposals'
      activeTable
      proposals={activeProposals}
    />
  )
}

export default ActiveProposals
