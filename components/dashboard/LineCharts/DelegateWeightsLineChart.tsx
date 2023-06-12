import { useMemo } from 'react'
import { useDashboard } from '../../../context/DashboardContext'
import { DelegateBalance, DelegateBalances } from '../../../lib/types/delegate'
import LineChart from './LineChart'

type Props = {
  constitutionalDelegates: DelegateBalance[] | undefined
  delegatesBalancesData: DelegateBalances[] | undefined
}

const DelegateWeightsLineChart = ({
  constitutionalDelegates,
  delegatesBalancesData,
}: Props) => {
  const { setSelectedTime } = useDashboard()

  return useMemo(
    () => (
      <LineChart
        data={
          constitutionalDelegates &&
          delegatesBalancesData &&
          constitutionalDelegates.map((del) => ({
            id: del.voteDelegate,
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
        title='Constitutional Delegates Vote Weights'
        mkrColors={false}
        enableClick={true}
        clickFunction={setSelectedTime}
        enableLegend={false}
        enableArea={true}
        stacked={true}
      />
    ),
    [delegatesBalancesData, constitutionalDelegates, setSelectedTime]
  )
}

export default DelegateWeightsLineChart
