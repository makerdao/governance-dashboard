import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import useSWRImmutable from 'swr/immutable'
import {
  createTheme,
  ThemeProvider,
  PaletteMode,
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Container,
} from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'

import {
  getGovernanceData,
  getStakedMkr,
  getPollVoters,
  getMkrBalances,
  getGroupedBalances,
  getDelegatesBalances,
} from '../lib/governanceData'
import AutocompleteInput from '../components/AutocompleteInput'
import TableCard from '../components/TableCard'
import DataCard from '../components/DataCard'
import LineChart from '../components/LineChart'
import SunburstChart from '../components/SunburstChart'
import PieChart from '../components/PieChart'
import BarChart from '../components/BarChart'
import { reduceAndFormatDelegations, reduceDelegators } from '../lib/helpers'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [selectedDelegate, setSelectedDelegate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<number | null>(null)
  const [mode, setMode] = useState<PaletteMode>('light')

  useEffect(() => {
    if (localStorage.getItem('theme'))
      setMode(localStorage.getItem('theme') as PaletteMode)
  }, [])

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', newMode)
    setMode(newMode)
  }

  // Fetch data - start
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
  const { data: groupedBalancesData } = useSWRImmutable(
    () => (governanceData && mkrBalancesData ? '/groupedBalancesData' : null),
    () => getGroupedBalances(governanceData?.topDelegates, mkrBalancesData)
  )
  const { data: delegatesBalancesData } = useSWRImmutable(
    () =>
      governanceData?.allDelegations && governanceData?.topDelegates
        ? '/delegatesBalancesData'
        : null,
    () =>
      getDelegatesBalances(
        governanceData?.allDelegations,
        governanceData?.topDelegates
      )
  )
  // Fetch data - end

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

  const handleSelectDelegate = (
    address: string | null,
    delegate?: string
  ): void => {
    setSelectedDelegate(delegate || null)
    setSelectedAddress(address)
  }

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: 'hsl(173, 74%, 39%)' },
      background: {
        default: mode === 'light' ? '#f7f8f9' : '#121212',
      },
    },
  })

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

        <AppBar color='default'>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <div className={styles.logoContainer}>
                <Image
                  src='/makerlogo.png'
                  alt='Maker logo'
                  width={42}
                  height={30}
                />
                <Typography variant='h6'>
                  MakerDAO Governance Metrics
                </Typography>
              </div>
            </Box>
            <Box sx={{ display: 'flex', gap: '0.5em' }}>
              <AutocompleteInput
                mkrBalancesData={mkrBalancesData}
                selectedAddress={selectedAddress}
                setSelectedAddress={handleSelectDelegate}
              />
              <IconButton onClick={toggleMode}>
                {theme.palette.mode === 'dark' ? (
                  <Brightness7 />
                ) : (
                  <Brightness4 />
                )}
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Box className={styles.main} bgcolor='background.default'>
          <TableCard
            title='Top Recognized Delegates'
            delegates={recognizedDelegates}
            setSelectedAddress={handleSelectDelegate}
          />
          <TableCard
            title='Top Shadow Delegates'
            delegates={shadowDelegates}
            setSelectedAddress={handleSelectDelegate}
          />
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
            data={
              stakedMkrData &&
              governanceData && [
                {
                  id: 'Staked',
                  data: stakedMkrData.mkrStakedData.map((entry) => ({
                    x: entry.time,
                    y: entry.amount,
                  })),
                },
                {
                  id: 'Delegated',
                  data: governanceData?.mkrDelegatedData.map((entry) => ({
                    x: entry.time,
                    y: entry.amount,
                  })),
                },
              ]
            }
            legendX='Date'
            legendY='MKR'
            title='Staked and Delegated MKR'
          />
          <LineChart
            data={
              mkrBalancesData && [
                {
                  id: 'Staked',
                  data: mkrBalancesData.map((entry) => ({
                    x: entry.time,
                    y:
                      entry.balances.find(
                        (bal) => bal.sender === selectedAddress
                      )?.amount || 0,
                  })),
                },
                {
                  id: 'Delegated',
                  data: mkrBalancesData.map((entry) => ({
                    x: entry.time,
                    y:
                      entry.balances.find(
                        (bal) => bal.sender === selectedAddress
                      )?.delegated || 0,
                  })),
                },
              ]
            }
            legendX='Date'
            legendY='MKR'
            title={
              selectedAddress
                ? `Staked and Delegated MKR for ${
                    selectedDelegate
                      ? 'delegate ' + selectedDelegate
                      : 'user ' +
                        selectedAddress.slice(0, 8) +
                        '...' +
                        selectedAddress.slice(38)
                  }`
                : 'Please select an address on the navbar selector to render the data'
            }
            enableArea={true}
          />
          <SunburstChart
            title='Current vote weights - select a user to see their stakes and delegations'
            data={groupedBalancesData}
            setSelectedAddress={setSelectedAddress}
            setSelectedDelegate={setSelectedDelegate}
            customColors={[
              'hsl(173, 74%, 39%)',
              'hsl(173, 35%, 65%)',
              'hsl(41, 90%, 57%)',
            ]}
          />
          <BarChart
            title='Average unique voters per poll per month'
            data={pollVotersData}
          />
          <LineChart
            data={
              recognizedDelegates &&
              delegatesBalancesData &&
              recognizedDelegates.map((del) => ({
                id: del.name || del.voteDelegate,
                data: delegatesBalancesData.map((entry) => ({
                  x: entry.time,
                  y:
                    entry.balances.find(
                      (bal) => bal.address === del.voteDelegate
                    )?.amount || 0,
                })),
              }))
            }
            legendX='Date'
            legendY='MKR'
            title='Recognized Delegates vote weights - click a data point to select time'
            mkrColors={false}
            enableClick={true}
            clickFunction={setSelectedTime}
            enableLegend={false}
            enableArea={true}
            stacked={true}
          />
          <PieChart
            title={`Delegates vote weights at selected time - ${
              selectedTime ? new Date(selectedTime).toLocaleDateString() : 'now'
            }`}
            data={
              recognizedDelegates &&
              delegatesBalancesData &&
              delegatesBalancesData
                .find((elem, idx, array) =>
                  selectedTime
                    ? elem.time.getTime() === selectedTime
                    : idx === array.length - 1
                )
                ?.balances.filter((del) => del.amount > 0)
                .map((del) => ({
                  id: del.name || del.address,
                  value: del.amount,
                  address: del.address,
                }))
            }
          />
        </Box>

        <Box
          bgcolor='background.default'
          borderTop='1px solid'
          borderColor='divider'
        >
          <footer className={styles.footer}>
            <div>
              <Typography color='text.secondary'>
                Built by{' '}
                <a
                  target='_blank'
                  rel='noreferrer'
                  href='https://forum.makerdao.com/u/hernandoagf'
                >
                  hernandoagf
                </a>
              </Typography>
            </div>
          </footer>
        </Box>
      </div>
    </ThemeProvider>
  )
}

export default Home
