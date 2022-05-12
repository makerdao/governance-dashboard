import ProposalsTable from '../../components/governance/ProposalsTable'
import { useTracker } from '../../context/TrackerContext'

const OnChainPolls = () => {
  const { onChainPolls } = useTracker()

  return <ProposalsTable title='On-chain polls' proposals={onChainPolls} />
}

export default OnChainPolls
