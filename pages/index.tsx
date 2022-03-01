import { useState, MouseEvent } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import useSWRImmutable from 'swr/immutable'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Skeleton,
  Card,
} from '@mui/material'

import {
  getGovernanceData,
  getStakedMkr,
  getPollVoters,
} from '../lib/governanceData'
import { kFormatter } from '../lib/helpers'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = useState<'lockTotal' | 'delegatorCount'>(
    'lockTotal'
  )

  const { data: governanceData, error } = useSWRImmutable(
    '/governanceData',
    getGovernanceData
  )
  const { data: stakedMkrData } = useSWRImmutable(
    '/stakedMkrData',
    getStakedMkr
  )
  const { data: pollVotersData } = useSWRImmutable(
    '/pollVotersData',
    getPollVoters
  )

  if (error) {
    console.log(error)
    return (
      <div>
        There was an error trying to load the data, please refresh the site
      </div>
    )
  }

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: 'lockTotal' | 'delegatorCount'
  ) => {
    const isAsc = orderBy === property && order === 'desc'
    setOrder(isAsc ? 'asc' : 'desc')
    setOrderBy(property)

    governanceData?.topDelegates.sort((a, b) =>
      // @ts-ignore
      isAsc ? a[property] - b[property] : b[property] - a[property]
    )
  }

  const handleSort =
    (property: 'lockTotal' | 'delegatorCount') =>
    (event: MouseEvent<unknown>) => {
      handleRequestSort(event, property)
    }

  return (
    <div className={styles.container}>
      <Head>
        <title>Maker Governance Metrics</title>
        <meta
          name='description'
          content='A dashboard containing metrics about MakerDAO governance and delegation'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <nav className={styles.nav}>
        <div className={styles.logoContainer}>
          <Image src='/makerlogo.png' alt='Maker logo' width={42} height={30} />
          MakerDAO Governance Metrics
        </div>
      </nav>

      <main className={styles.main}>
        <Card className={styles.tableCard}>
          <h3>Top Recognized Delegates</h3>
          {!governanceData ? (
            <>
              <Skeleton animation='wave' height={65} />
              <Skeleton animation='wave' height={65} />
              <Skeleton animation='wave' height={65} />
              <Skeleton animation='wave' height={65} />
              <Skeleton animation='wave' height={65} />
            </>
          ) : (
            <TableContainer sx={{ maxHeight: 'calc(100% - 50px)' }}>
              <Table stickyHeader size='small' aria-label='top delegates table'>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align='center'
                      style={{
                        textTransform: 'capitalize',
                        fontWeight: 'bold',
                      }}
                    >
                      Delegate
                    </TableCell>
                    <TableCell
                      align='center'
                      style={{
                        textTransform: 'capitalize',
                        fontWeight: 'bold',
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'delegatorCount'}
                        direction={
                          orderBy === 'delegatorCount' ? order : 'desc'
                        }
                        onClick={handleSort('delegatorCount')}
                      >
                        Delegators
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      align='center'
                      style={{
                        textTransform: 'capitalize',
                        fontWeight: 'bold',
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'lockTotal'}
                        direction={orderBy === 'lockTotal' ? order : 'desc'}
                        onClick={handleSort('lockTotal')}
                      >
                        MKR Delegated
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {governanceData.topDelegates
                    .filter((delegate) => delegate.status === 'recognized')
                    .map((delegate, i) => (
                      <TableRow hover key={i}>
                        <TableCell align='left'>
                          {delegate.name || delegate.voteDelegate}
                        </TableCell>
                        <TableCell align='center'>
                          {delegate.delegatorCount}
                        </TableCell>
                        <TableCell align='center'>
                          {parseInt(delegate.lockTotal).toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
        <Card className={styles.tableCard}>
          <h3>Top Shadow Delegates</h3>
          {!governanceData ? (
            <>
              <Skeleton animation='wave' height={65} />
              <Skeleton animation='wave' height={65} />
              <Skeleton animation='wave' height={65} />
              <Skeleton animation='wave' height={65} />
              <Skeleton animation='wave' height={65} />
            </>
          ) : (
            <TableContainer sx={{ maxHeight: 'calc(100% - 50px)' }}>
              <Table stickyHeader size='small' aria-label='top delegates table'>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align='center'
                      style={{
                        textTransform: 'capitalize',
                        fontWeight: 'bold',
                      }}
                    >
                      Delegate
                    </TableCell>
                    <TableCell
                      align='center'
                      style={{
                        textTransform: 'capitalize',
                        fontWeight: 'bold',
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'delegatorCount'}
                        direction={
                          orderBy === 'delegatorCount' ? order : 'desc'
                        }
                        onClick={handleSort('delegatorCount')}
                      >
                        Delegators
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      align='center'
                      style={{
                        textTransform: 'capitalize',
                        fontWeight: 'bold',
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'lockTotal'}
                        direction={orderBy === 'lockTotal' ? order : 'desc'}
                        onClick={handleSort('lockTotal')}
                      >
                        MKR Delegated
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {governanceData.topDelegates
                    .filter((delegate) => delegate.status === 'shadow')
                    .map((delegate, i) => (
                      <TableRow hover key={i}>
                        <TableCell align='left'>
                          {delegate.name || delegate.voteDelegate}
                        </TableCell>
                        <TableCell align='center'>
                          {delegate.delegatorCount}
                        </TableCell>
                        <TableCell align='center'>
                          {parseInt(delegate.lockTotal).toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
        <Card className={styles.infoCard}>
          <h3>Delegates count</h3>
          {!governanceData ? (
            <>
              <Skeleton animation='wave' height={80} />
            </>
          ) : (
            <div className={styles.infoCardContainer}>
              <div className={styles.thirdWidth}>
                <p className={styles.infoCardValue}>
                  {
                    governanceData.topDelegates.filter(
                      (delegate) => delegate.status === 'recognized'
                    ).length
                  }
                </p>
                <p className={styles.infoCardLabel}>Recognized</p>
              </div>
              <div className={styles.thirdWidth}>
                <p className={styles.infoCardValue}>
                  {
                    governanceData.topDelegates.filter(
                      (delegate) => delegate.status === 'shadow'
                    ).length
                  }
                </p>
                <p className={styles.infoCardLabel}>Shadow</p>
              </div>
              <div className={styles.thirdWidth}>
                <p className={styles.infoCardValue}>
                  {governanceData.topDelegates.length}
                </p>
                <p className={styles.infoCardLabel}>Total</p>
              </div>
            </div>
          )}
        </Card>
        <Card className={styles.infoCard}>
          <h3>MKR delegated</h3>
          {!governanceData ? (
            <>
              <Skeleton animation='wave' height={80} />
            </>
          ) : (
            <div className={styles.infoCardContainer}>
              <div className={styles.thirdWidth}>
                <p className={styles.infoCardValue}>
                  {kFormatter(
                    governanceData.topDelegates
                      .filter((delegate) => delegate.status === 'recognized')
                      .reduce(
                        (acum, delegate) => acum + parseInt(delegate.lockTotal),
                        0
                      )
                  )}
                </p>
                <p className={styles.infoCardLabel}>Recognized</p>
              </div>
              <div className={styles.thirdWidth}>
                <p className={styles.infoCardValue}>
                  {kFormatter(
                    governanceData.topDelegates
                      .filter((delegate) => delegate.status === 'shadow')
                      .reduce(
                        (acum, delegate) => acum + parseInt(delegate.lockTotal),
                        0
                      )
                  )}
                </p>
                <p className={styles.infoCardLabel}>Shadow</p>
              </div>
              <div className={styles.thirdWidth}>
                <p className={styles.infoCardValue}>
                  {kFormatter(
                    governanceData.topDelegates.reduce(
                      (acum, delegate) => acum + parseInt(delegate.lockTotal),
                      0
                    )
                  )}
                </p>
                <p className={styles.infoCardLabel}>Total</p>
              </div>
            </div>
          )}
        </Card>
        <Card className={styles.infoCard}>
          <h3>Delegators count</h3>
          {!governanceData ? (
            <>
              <Skeleton animation='wave' height={80} />
            </>
          ) : (
            <div className={styles.infoCardContainer}>
              <div className={styles.thirdWidth}>
                <p className={styles.infoCardValue}>
                  {governanceData.topDelegates
                    .filter((delegate) => delegate.status === 'recognized')
                    .reduce(
                      (acum, delegate) => acum + delegate.delegatorCount,
                      0
                    )}
                </p>
                <p className={styles.infoCardLabel}>Recognized</p>
              </div>
              <div className={styles.thirdWidth}>
                <p className={styles.infoCardValue}>
                  {governanceData.topDelegates
                    .filter((delegate) => delegate.status === 'shadow')
                    .reduce(
                      (acum, delegate) => acum + delegate.delegatorCount,
                      0
                    )}
                </p>
                <p className={styles.infoCardLabel}>Shadow</p>
              </div>
              <div className={styles.thirdWidth}>
                <p className={styles.infoCardValue}>
                  {governanceData.topDelegates.reduce(
                    (acum, delegate) => acum + delegate.delegatorCount,
                    0
                  )}
                </p>
                <p className={styles.infoCardLabel}>Total</p>
              </div>
            </div>
          )}
        </Card>
        <Card className={styles.chartCard}>
          <h3>Staked and Delegated MKR</h3>
          <div className={styles.chartContainer}>
            {!governanceData || !stakedMkrData ? (
              <Skeleton variant='rectangular' height={'90%'} animation='wave' />
            ) : (
              <ResponsiveLine
                data={[
                  {
                    id: 'MKR staked',
                    color: 'hsl(173, 74%, 39%)',
                    data: stakedMkrData.map((entry) => ({
                      x: entry.time,
                      y: entry.amount,
                    })),
                  },
                  {
                    id: 'MKR delegated',
                    color: 'hsl(41, 90%, 57%)',
                    data: governanceData.mkrDelegatedData.map((entry) => ({
                      x: entry.time,
                      y: entry.amount,
                    })),
                  },
                ]}
                xScale={{
                  type: 'time',
                  format: '%Y-%m-%dT%H:%M:%SZ',
                }}
                xFormat='time:%b %d, %Y'
                yFormat='.3s'
                margin={{ left: 60, bottom: 40, top: 5 }}
                theme={{
                  axis: {
                    legend: {
                      text: {
                        fontWeight: 'bold',
                      },
                    },
                  },
                }}
                colors={{ datum: 'color' }}
                enablePoints={false}
                // enableGridX={false}
                // enableGridY={false}
                axisLeft={{
                  legend: 'MKR',
                  legendOffset: -50,
                  legendPosition: 'middle',
                  format: '.2s',
                }}
                axisBottom={{
                  legend: 'Time',
                  legendOffset: 36,
                  legendPosition: 'middle',
                  tickValues: 'every 2 months',
                  format: '%b %d, %Y',
                }}
                isInteractive={true}
                useMesh={true}
              />
            )}
          </div>
        </Card>
        <Card className={styles.chartCard}>
          <h3>Average unique voters per poll per month</h3>
          <div className={styles.chartContainer}>
            {!pollVotersData ? (
              <Skeleton variant='rectangular' height={'90%'} animation='wave' />
            ) : (
              <ResponsiveBar
                data={pollVotersData}
                keys={['uniqueVoters']}
                indexBy='month'
                margin={{ left: 60, bottom: 40, top: 5 }}
                padding={0.2}
                theme={{
                  axis: {
                    legend: {
                      text: {
                        fontWeight: 'bold',
                      },
                    },
                  },
                }}
                defs={[
                  {
                    id: 'bar-fill',
                    type: 'patternLines',
                    background: '#f4b62f',
                    color: '#f4b62f',
                  },
                ]}
                fill={[
                  {
                    match: {
                      id: 'uniqueVoters',
                    },
                    id: 'bar-fill',
                  },
                ]}
                axisLeft={{
                  legend: 'Voters',
                  legendOffset: -50,
                  legendPosition: 'middle',
                  format: '.2s',
                }}
                axisBottom={{
                  legend: 'Month',
                  legendOffset: 36,
                  legendPosition: 'middle',
                  tickValues: pollVotersData
                    .filter((entry, i) => i % 3 === 0)
                    .map((entry) => entry.month),
                }}
                isInteractive={true}
                enableLabel={false}
              />
            )}
          </div>
        </Card>
        {/* <Card className={styles.chartCard}>
          <h3>Total MKR Delegated</h3>
          <div className={styles.chartContainer}>
            {!governanceData ? (
              <Skeleton
                variant='rectangular'
                height={'100%'}
                animation='wave'
              />
            ) : (
              <ResponsiveLine
                data={[
                  {
                    id: 'MKR delegated',
                    color: 'hsl(173, 74%, 39%)',
                    data: governanceData.mkrDelegatedData.map((entry) => ({
                      x: entry.time,
                      y: entry.amount,
                    })),
                  },
                ]}
                xScale={{
                  type: 'time',
                  format: '%Y-%m-%dT%H:%M:%SZ',
                }}
                xFormat='time:%b %d, %Y'
                yFormat='.3s'
                margin={{ left: 60, bottom: 50, top: 5 }}
                theme={{
                  axis: {
                    legend: {
                      text: {
                        fontWeight: 'bold',
                      },
                    },
                  },
                }}
                colors={{ datum: 'color' }}
                enablePoints={false}
                axisLeft={{
                  legend: 'MKR delegated',
                  legendOffset: -50,
                  legendPosition: 'middle',
                  format: '.0s',
                }}
                axisBottom={{
                  legend: 'Time',
                  legendOffset: 36,
                  legendPosition: 'middle',
                  tickValues: 'every month',
                  format: '%b %d, %Y',
                }}
                isInteractive={true}
                useMesh={true}
              />
            )}
          </div>
        </Card> */}
      </main>

      <footer className={styles.footer}>Built by the GovAlpha Core Unit</footer>
    </div>
  )
}

export default Home
