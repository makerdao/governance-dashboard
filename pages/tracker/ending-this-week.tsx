import ProposalsTable from '../../components/governance/ProposalsTable'
import { useTracker } from '../../context/TrackerContext'

const EndingThisWeekProposals = () => {
  const { endingThisWeekProposals } = useTracker()

  return (
    <ProposalsTable
      title='Proposals ending this week'
      timeTable
      proposals={endingThisWeekProposals}
    />
  )
}

export default EndingThisWeekProposals
