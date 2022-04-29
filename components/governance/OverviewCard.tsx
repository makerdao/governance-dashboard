import {
  Card,
  CardContent,
  CardActions,
  CardActionArea,
  Button,
  Typography,
  Box,
  Divider,
} from '@mui/material'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { DateTime } from 'luxon'

import { Proposal } from '../../lib/types/tracker'
import styles from '../../styles/Home.module.css'
import Loading from '../Loading'

type Props = {
  proposals: Proposal[] | undefined
  title: string
  type: string
  href: string
  buttonHref: string
}

const OverviewCard = ({
  proposals,
  title,
  type,
  href,
  buttonHref,
}: Props): JSX.Element => {
  const router = useRouter()

  const thisWeekEnd = DateTime.utc().endOf('week')
  const nextWeekEnd = thisWeekEnd.plus({ week: 1 })

  const activeProposals = proposals?.filter(
    (p) => p.activityStatus === 'Active' || !p.activityStatus
  )
  const pendingProposals = proposals?.filter(
    (p) => p.activityStatus === 'Pending'
  )

  const amountActive = activeProposals?.length
  const amountPending = pendingProposals?.length
  const highImpactActive = activeProposals?.filter(
    (p) => p.impact === 'High'
  ).length
  const mediumImpactActive = activeProposals?.filter(
    (p) => p.impact === 'Medium'
  ).length
  const lowImpactActive = activeProposals?.filter(
    (p) => p.impact === 'Low'
  ).length
  const highImpactPending = pendingProposals?.filter(
    (p) => p.impact === 'High'
  ).length
  const mediumImpactPending = pendingProposals?.filter(
    (p) => p.impact === 'Medium'
  ).length
  const lowImpactPending = pendingProposals?.filter(
    (p) => p.impact === 'Low'
  ).length
  const endingThisWeek = activeProposals?.filter(
    (p) => DateTime.fromISO(p.endDate) < thisWeekEnd
  ).length
  const endingNextWeek = activeProposals?.filter(
    (p) =>
      DateTime.fromISO(p.endDate) > thisWeekEnd &&
      DateTime.fromISO(p.endDate) < nextWeekEnd
  ).length
  const startingThisWeek = pendingProposals?.filter(
    (p) => DateTime.fromISO(p.endDate) < thisWeekEnd
  ).length
  const startingNextWeek = pendingProposals?.filter(
    (p) =>
      DateTime.fromISO(p.endDate) > thisWeekEnd &&
      DateTime.fromISO(p.endDate) < nextWeekEnd
  ).length

  return (
    <Card className={styles.overviewCard}>
      <CardActionArea
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'flex-start',
        }}
        onClick={() => router.push(href)}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant='h5' gutterBottom>
            {title}
          </Typography>
          {!proposals ? (
            <Loading count={5} />
          ) : !proposals.length ? (
            <Typography>
              No active or pending {title.toLocaleLowerCase()} at the moment
            </Typography>
          ) : (
            <>
              {amountActive !== 0 && (
                <Box mt={3}>
                  <Typography
                    component='span'
                    className={styles.overviewCardSubHeading}
                  >
                    <Box component='span' className={styles.overviewActiveTag}>
                      {amountActive} active
                    </Box>
                  </Typography>
                  <Divider light className={styles.cardDivider}>
                    Impact
                  </Divider>
                  <Typography className={styles.overviewText}>
                    {highImpactActive && highImpactActive > 0 && (
                      <span>{highImpactActive} high</span>
                    )}
                    {mediumImpactActive && mediumImpactActive > 0 && (
                      <span>{mediumImpactActive} medium</span>
                    )}
                    {lowImpactActive && lowImpactActive > 0 && (
                      <span>{lowImpactActive} low</span>
                    )}
                  </Typography>
                  {(endingThisWeek !== 0 || endingNextWeek !== 0) && (
                    <>
                      <Divider light className={styles.cardDivider}>
                        End date
                      </Divider>
                      <Typography className={styles.overviewText}>
                        {endingThisWeek !== 0 && (
                          <span>{endingThisWeek} this week</span>
                        )}
                        {endingNextWeek !== 0 && (
                          <span>{endingNextWeek} next week</span>
                        )}
                      </Typography>
                    </>
                  )}
                </Box>
              )}
              {amountPending !== 0 && (
                <Box mt={3}>
                  <Typography className={styles.overviewCardSubHeading}>
                    <Box component='span' className={styles.overviewPendingTag}>
                      {amountPending} pending
                    </Box>
                  </Typography>
                  <Divider light className={styles.cardDivider}>
                    Impact
                  </Divider>
                  <Typography className={styles.overviewText}>
                    {highImpactPending && highImpactPending > 0 && (
                      <span>{highImpactPending} high</span>
                    )}
                    {mediumImpactPending && mediumImpactPending > 0 && (
                      <span>{mediumImpactPending} medium</span>
                    )}
                    {lowImpactPending && lowImpactPending > 0 && (
                      <span>{lowImpactPending} low</span>
                    )}
                  </Typography>
                  {(startingThisWeek !== 0 || startingNextWeek !== 0) && (
                    <>
                      <Divider light className={styles.cardDivider}>
                        Start date
                      </Divider>
                      <Typography className={styles.overviewText}>
                        {startingThisWeek !== 0 && (
                          <span>{startingThisWeek} this week</span>
                        )}
                        {startingNextWeek !== 0 && (
                          <span>{startingNextWeek} next week</span>
                        )}
                      </Typography>
                    </>
                  )}
                </Box>
              )}
            </>
          )}
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Link passHref href={buttonHref}>
          <Button
            size='small'
            sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
          >
            {type === 'discussion' ? 'Engage' : 'Go vote'}
          </Button>
        </Link>
      </CardActions>
    </Card>
  )
}

export default OverviewCard
