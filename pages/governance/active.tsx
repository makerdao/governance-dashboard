import useSWRImmutable from 'swr/immutable'
import { Box } from '@mui/material'

import styles from '../../styles/Home.module.css'
import ProposalsTable from '../../components/governance/ProposalsTable'

const GovernancePage = () => {
  const fetcher = (endpoint: string) =>
    fetch(endpoint).then((res) => res.json())
  const { data: proposalsData } = useSWRImmutable('/api/sheets', fetcher)

  return (
    <Box className={styles.mainFlex} bgcolor='background.default'>
      <ProposalsTable
        title='Executive votes'
        proposals={proposalsData?.executive}
      />
      <ProposalsTable
        title='On-chain polls'
        proposals={proposalsData?.onChainPolls}
      />
      <ProposalsTable
        title='Off-chain polls'
        proposals={proposalsData?.offChainPolls}
      />
      <ProposalsTable
        title='Forum discussions'
        proposals={proposalsData?.forumDiscussions}
      />
    </Box>
  )
}

export default GovernancePage
