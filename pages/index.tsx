import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import useSWRImmutable from 'swr/immutable'
import { Box } from '@mui/material'

import {
  getGovernanceData,
  getStakedMkr,
  getPollVoters,
  getMkrBalances,
  getGroupedBalances,
  getDelegatesBalances,
} from '../lib/metrics/governanceData'
import TableCard from '../components/TableCard'
import DataCard from '../components/DataCard'
import LineChart from '../components/LineChart'
import SunburstChart from '../components/SunburstChart'
import PieChart from '../components/PieChart'
import BarChart from '../components/BarChart'
import { reduceAndFormatDelegations, reduceDelegators } from '../lib/helpers'
import styles from '../styles/Home.module.css'
import { UserBalances } from '../lib/types/delegate'

type Props = {
  setMkrBalancesData: Dispatch<SetStateAction<UserBalances[]>>
  handleSelectDelegate: (
    address: string | null,
    delegate?: string | undefined
  ) => void
  selectedAddress: string | null
  selectedDelegate: string | null
  setSelectedAddress: Dispatch<SetStateAction<string | null>>
  setSelectedDelegate: Dispatch<SetStateAction<string | null>>
}

const Home = ({
  setMkrBalancesData,
  handleSelectDelegate,
  selectedAddress,
  selectedDelegate,
  setSelectedAddress,
  setSelectedDelegate,
}: Props) => {
  const [selectedTime, setSelectedTime] = useState<number | null>(null)

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

  useEffect(() => {
    if (mkrBalancesData?.length) setMkrBalancesData(mkrBalancesData)
    // eslint-disable-next-line
  }, [mkrBalancesData])

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
              value: reduceAndFormatDelegations(governanceData.topDelegates),
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
      <SunburstChart
        title='Current Vote Weights for all users'
        data={groupedBalancesData}
        setSelectedAddress={setSelectedAddress}
        setSelectedDelegate={setSelectedDelegate}
        customColors={[
          'hsl(173, 74%, 39%)',
          'hsl(173, 35%, 65%)',
          'hsl(41, 90%, 57%)',
        ]}
      />
      <LineChart
        data={
          mkrBalancesData && [
            {
              id: 'Delegated',
              data: mkrBalancesData.map((entry) => ({
                x: entry.time,
                y:
                  entry.balances.find((bal) => bal.sender === selectedAddress)
                    ?.delegated || 0,
              })),
            },
            {
              id: 'Staked',
              data: mkrBalancesData.map((entry) => ({
                x: entry.time,
                y:
                  entry.balances.find((bal) => bal.sender === selectedAddress)
                    ?.amount || 0,
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
            : 'Staked and Delegated MKR - select an address to see the data'
        }
        enableArea={true}
        infoTooltipText='You can select an address on the navbar selector, a delegate on the delegates tables or a user on the Current Vote Weights chart'
      />
      <LineChart
        data={
          stakedMkrData &&
          governanceData && [
            {
              id: 'Delegated',
              data: governanceData?.mkrDelegatedData.map((entry) => ({
                x: entry.time,
                y: entry.amount,
              })),
            },
            {
              id: 'Staked',
              data: stakedMkrData.mkrStakedData.map((entry) => ({
                x: entry.time,
                y: entry.amount,
              })),
            },
          ]
        }
        legendX='Date'
        legendY='MKR'
        title='Total Staked and Delegated MKR'
      />
      <BarChart
        title='Average Unique Voters per poll per month'
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
                entry.balances.find((bal) => bal.address === del.voteDelegate)
                  ?.amount || 0,
            })),
          }))
        }
        legendX='Date'
        legendY='MKR'
        title='Recognized Delegates Vote Weights'
        mkrColors={false}
        enableClick={true}
        clickFunction={setSelectedTime}
        enableLegend={false}
        enableArea={true}
        stacked={true}
      />
      <PieChart
        title={`All Delegates Vote Weights at selected time - ${
          selectedTime ? new Date(selectedTime).toLocaleDateString() : 'now'
        }`}
        infoTooltipText='You can select the time by clicking on a data point on the Recognized Delegates Vote Weights chart'
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
  )
}

export default Home
