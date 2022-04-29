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
import { ReactNode } from 'react'

type Props = {
  proposals: Proposal[] | undefined
  title: string
  type: string
  href: string
  buttonHref: string
}

const SubHeading = ({ children }: { children: ReactNode }) => (
  <Typography
    component='span'
    sx={{
      margin: '1em 0',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      letterSpacing: '0.75px',
      display: 'flex',
      color: 'white',
    }}
  >
    {children}
  </Typography>
)

const OverviewText = ({ children }: { children: ReactNode }) => (
  <Typography
    sx={{
      margin: '0.5em',
      display: 'flex',
      gap: '0.5em',
    }}
  >
    {children}
  </Typography>
)

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
                  <SubHeading>
                    <Box component='span' className={styles.overviewActiveTag}>
                      {amountActive} active
                    </Box>
                  </SubHeading>
                  <Divider light className={styles.cardDivider}>
                    Impact
                  </Divider>
                  <OverviewText>
                    {typeof highImpactActive !== 'undefined' &&
                      highImpactActive > 0 && (
                        <span>{highImpactActive} high</span>
                      )}
                    {typeof mediumImpactActive !== 'undefined' &&
                      mediumImpactActive > 0 && (
                        <span>{mediumImpactActive} medium</span>
                      )}
                    {typeof lowImpactActive !== 'undefined' &&
                      lowImpactActive > 0 && <span>{lowImpactActive} low</span>}
                  </OverviewText>
                  {(endingThisWeek !== 0 || endingNextWeek !== 0) && (
                    <>
                      <Divider light className={styles.cardDivider}>
                        End date
                      </Divider>
                      <OverviewText>
                        {endingThisWeek !== 0 && (
                          <span>{endingThisWeek} this week</span>
                        )}
                        {endingNextWeek !== 0 && (
                          <span>{endingNextWeek} next week</span>
                        )}
                      </OverviewText>
                    </>
                  )}
                </Box>
              )}
              {amountPending !== 0 && (
                <Box mt={3}>
                  <SubHeading>
                    <Box component='span' className={styles.overviewPendingTag}>
                      {amountPending} pending
                    </Box>
                  </SubHeading>
                  <Divider light className={styles.cardDivider}>
                    Impact
                  </Divider>
                  <OverviewText>
                    {typeof highImpactPending !== 'undefined' &&
                      highImpactPending > 0 && (
                        <span>{highImpactPending} high</span>
                      )}
                    {typeof mediumImpactPending !== 'undefined' &&
                      mediumImpactPending > 0 && (
                        <span>{mediumImpactPending} medium</span>
                      )}
                    {typeof lowImpactPending !== 'undefined' &&
                      lowImpactPending > 0 && (
                        <span>{lowImpactPending} low</span>
                      )}
                  </OverviewText>
                  {(startingThisWeek !== 0 || startingNextWeek !== 0) && (
                    <>
                      <Divider light className={styles.cardDivider}>
                        Start date
                      </Divider>
                      <OverviewText>
                        {startingThisWeek !== 0 && (
                          <span>{startingThisWeek} this week</span>
                        )}
                        {startingNextWeek !== 0 && (
                          <span>{startingNextWeek} next week</span>
                        )}
                      </OverviewText>
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
