import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import useSWRImmutable from 'swr/immutable'
import { createTheme, ThemeProvider } from '@mui/material'

import {
  getGovernanceData,
  getStakedMkr,
  getPollVoters,
  getMkrBalances,
} from '../lib/governanceData'
import AutocompleteInput from '../components/AutocompleteInput'
import TableCard from '../components/TableCard'
import DataCard from '../components/DataCard'
import LineChart from '../components/LineChart'
import BarChart from '../components/BarChart'
import { reduceAndFormatDelegations, reduceDelegators } from '../lib/helpers'
import styles from '../styles/Home.module.css'

const theme = createTheme({
  palette: { primary: { main: 'hsl(173, 74%, 39%)' } },
})

const Home: NextPage = () => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)

  const { data: governanceData } = useSWRImmutable(
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
  const { data: mkrBalancesData } = useSWRImmutable(
    () => (governanceData && stakedMkrData ? '/mkrBalancesData' : null),
    () =>
      getMkrBalances(governanceData?.allDelegations, stakedMkrData?.stakeEvents)
  )

  const recognizedDelegates =
    governanceData &&
    governanceData.topDelegates.filter(
      (delegate) => delegate.status === 'recognized'
    )

  const shadowDelegates =
    governanceData &&
    governanceData.topDelegates.filter(
      (delegate) => delegate.status === 'shadow'
    )

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.container}>
        <Head>
          <title>MakerDAO Governance Dashboard</title>
          <meta
            name='description'
            content='A dashboard containing metrics about MakerDAO governance and delegation'
          />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <nav className={styles.nav}>
          <div className={styles.logoContainer}>
            <Image
              src='/makerlogo.png'
              alt='Maker logo'
              width={42}
              height={30}
            />
            MakerDAO Governance Metrics
          </div>
          <AutocompleteInput
            mkrBalancesData={mkrBalancesData}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        </nav>

        <main className={styles.main}>
          <TableCard
            title='Top Recognized Delegates'
            delegates={recognizedDelegates}
          />
          <TableCard title='Top Shadow Delegates' delegates={shadowDelegates} />
          <DataCard
            title='Delegates count'
            data={
              governanceData && [
                { name: 'Recognized', value: recognizedDelegates?.length || 0 },
                { name: 'Shadow', value: shadowDelegates?.length || 0 },
                { name: 'Total', value: governanceData.topDelegates.length },
              ]
            }
          />
          <DataCard
            title='MKR delegated'
            data={
              governanceData && [
                {
                  name: 'Recognized',
                  value: reduceAndFormatDelegations(recognizedDelegates),
                },
                {
                  name: 'Shadow',
                  value: reduceAndFormatDelegations(shadowDelegates),
                },
                {
                  name: 'Total',
                  value: reduceAndFormatDelegations(
                    governanceData.topDelegates
                  ),
                },
              ]
            }
          />
          <DataCard
            title='Delegators count'
            data={
              governanceData && [
                {
                  name: 'Recognized',
                  value: reduceDelegators(recognizedDelegates),
                },
                { name: 'Shadow', value: reduceDelegators(shadowDelegates) },
                {
                  name: 'Total',
                  value: reduceDelegators(governanceData.topDelegates),
                },
              ]
            }
          />
          <LineChart
            datasetOne={stakedMkrData?.mkrStakedData.map((entry) => ({
              x: entry.time,
              y: entry.amount,
            }))}
            datasetTwo={governanceData?.mkrDelegatedData.map((entry) => ({
              x: entry.time,
              y: entry.amount,
            }))}
            datasetOneId='Staked'
            datasetTwoId='Delegated'
            legendX='Date'
            legendY='MKR'
            title='Staked and Delegated MKR'
          />
          <LineChart
            datasetOne={mkrBalancesData?.map((entry) => ({
              x: entry.time,
              y:
                entry.balances.find((bal) => bal.sender === selectedAddress)
                  ?.amount || 0,
            }))}
            datasetTwo={mkrBalancesData?.map((entry) => ({
              x: entry.time,
              y:
                entry.balances.find((bal) => bal.sender === selectedAddress)
                  ?.delegated || 0,
            }))}
            datasetOneId='Staked'
            datasetTwoId='Delegated'
            legendX='Date'
            legendY='MKR'
            title={
              selectedAddress
                ? `Staked and Delegated MKR for user ${
                    selectedAddress.slice(0, 8) +
                    '...' +
                    selectedAddress.slice(38)
                  }`
                : 'Please select an address on the navbar selector to render the data'
            }
            enableArea={true}
          />
          <BarChart
            title='Average unique voters per poll per month'
            data={pollVotersData}
          />
        </main>

        <footer className={styles.footer}>
          Built by the GovAlpha Core Unit
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default Home
