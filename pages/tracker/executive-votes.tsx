import ProposalsTable from '../../components/governance/ProposalsTable'
import { useTracker } from '../../context/TrackerContext'

const ExecutiveVotes = () => {
  const { executiveProposals } = useTracker()

  return (
    <ProposalsTable title='Executive votes' proposals={executiveProposals} />
  )
}

export default ExecutiveVotes
