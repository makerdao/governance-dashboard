import { Typography, Box } from '@mui/material'

import styles from '../../styles/Home.module.css'
import { useTracker } from '../../context/TrackerContext'
import OverviewCard from '../../components/governance/OverviewCard'

const GovernancePage = () => {
  const { executiveProposals, onChainPolls, offChainPolls, forumDiscussions } =
    useTracker()

  return (
    <>
      <Typography
        variant='h5'
        sx={{ color: (theme) => theme.palette.text.primary, mb: 0.5 }}
      >
        Overview
      </Typography>
      <Box className={styles.overviewContainer}>
        <OverviewCard
          title='Executive votes'
          type='vote'
          href='/tracker/executive-votes'
          proposals={executiveProposals}
          buttonHref='https://vote.makerdao.com/executive'
        />
        <OverviewCard
          title='On-chain polls'
          type='poll'
          href='/tracker/on-chain-polls'
          proposals={onChainPolls}
          buttonHref='https://vote.makerdao.com/polling'
        />
        <OverviewCard
          title='Off-chain polls'
          type='poll'
          href='/tracker/off-chain-polls'
          proposals={offChainPolls}
          buttonHref='https://forum.makerdao.com/'
        />
        <OverviewCard
          title='Forum discussions'
          type='discussion'
          href='/tracker/forum-discussions'
          proposals={forumDiscussions}
          buttonHref='https://forum.makerdao.com/'
        />
      </Box>
    </>
  )
}

export default GovernancePage
