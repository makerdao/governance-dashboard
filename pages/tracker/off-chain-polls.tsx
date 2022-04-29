import ProposalsTable from '../../components/governance/ProposalsTable'
import { useTracker } from '../../context/TrackerContext'

const OffChainPolls = () => {
  const { offChainPolls } = useTracker()

  return <ProposalsTable title='Off-Chain polls' proposals={offChainPolls} />
}

export default OffChainPolls
