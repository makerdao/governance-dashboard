import useSWRImmutable from 'swr/immutable'

import {
  getGovernanceData,
  getStakedMkr,
  getPollVoters,
  getMkrBalances,
  getGroupedBalances,
  getDelegatesBalances,
} from '../lib/metrics/governanceData'
import TableCard from '../components/dashboard/TableCard'
import DataCard from '../components/dashboard/DataCard'
import SunburstChart from '../components/dashboard/SunburstChart'
import PieChart from '../components/dashboard/PieChart'
import BarChart from '../components/dashboard/BarChart'
import SankeyChart from '../components/dashboard/SankeyChart'
import DashboardMoreMenu from '../components/dashboard/DashboardMoreMenu'
import IndividualMkrLineChart from '../components/dashboard/LineCharts/IndividualMkrLineChart'
import TotalMkrLineChart from '../components/dashboard/LineCharts/TotalMkrLineChart'
import DelegateWeightsLineChart from '../components/dashboard/LineCharts/DelegateWeightsLineChart'

const Home = () => {
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
      (delegate) => delegate.status !== 'recognized'
    )

  return (
    <>
      <DashboardMoreMenu mkrBalancesData={mkrBalancesData} />
      <TableCard
        title='Top Recognized Delegates'
        delegates={recognizedDelegates}
      />
      <TableCard title='Top Shadow Delegates' delegates={shadowDelegates} />
      <DataCard
        title='Delegates count'
        type='delegates-count'
        data={governanceData && governanceData.topDelegates}
      />
      <DataCard
        title='MKR delegated'
        type='mkr-delegated'
        data={governanceData && governanceData.topDelegates}
      />
      <DataCard
        title='Delegators count'
        type='delegators-count'
        data={governanceData && governanceData.topDelegates}
      />
      <SunburstChart
        title='Current Vote Weights for all users'
        data={groupedBalancesData}
        customColors={[
          'hsl(173, 74%, 39%)',
          'hsl(173, 35%, 65%)',
          'hsl(41, 90%, 57%)',
        ]}
      />
      <IndividualMkrLineChart data={mkrBalancesData} />
      <TotalMkrLineChart
        mkrStakedData={stakedMkrData?.mkrStakedData}
        mkrDelegatedData={governanceData?.mkrDelegatedData}
      />
      <BarChart
        title='Average Unique Voters per poll per month'
        data={pollVotersData}
      />
      <DelegateWeightsLineChart
        recognizedDelegates={recognizedDelegates}
        delegatesBalancesData={delegatesBalancesData}
      />
      <PieChart data={delegatesBalancesData} />
      <SankeyChart
        title='MKR delegation'
        infoTooltipText='Click on a delegator or delegate to render the specific chart'
        data={governanceData?.sankeyData}
        recognizedDelegates={recognizedDelegates}
      />
    </>
  )
}

export default Home
