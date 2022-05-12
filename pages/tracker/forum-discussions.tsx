import ProposalsTable from '../../components/governance/ProposalsTable'
import { useTracker } from '../../context/TrackerContext'

const ForumDiscussions = () => {
  const { forumDiscussions } = useTracker()

  return (
    <ProposalsTable title='Forum discussions' proposals={forumDiscussions} />
  )
}

export default ForumDiscussions
