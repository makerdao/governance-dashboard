import ProposalsTable from '../../components/governance/ProposalsTable'
import { useTracker } from '../../context/TrackerContext'

const HighImpactProposals = () => {
  const { highImpactProposals } = useTracker()

  return (
    <ProposalsTable
      title='High impact proposals'
      impactTable
      proposals={highImpactProposals}
    />
  )
}

export default HighImpactProposals
