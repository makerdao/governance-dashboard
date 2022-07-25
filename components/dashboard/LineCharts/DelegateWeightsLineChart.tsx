import { useDashboard } from '../../../context/DashboardContext'
import { DelegateBalance, DelegateBalances } from '../../../lib/types/delegate'
import LineChart from './LineChart'

type Props = {
  recognizedDelegates: DelegateBalance[] | undefined
  delegatesBalancesData: DelegateBalances[] | undefined
}

const DelegateWeightsLineChart = ({
  recognizedDelegates,
  delegatesBalancesData,
}: Props) => {
  const { setSelectedTime } = useDashboard()

  return (
    <LineChart
      data={
        recognizedDelegates &&
        delegatesBalancesData &&
        recognizedDelegates.map((del) => ({
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
      title='Recognized Delegates Vote Weights'
      mkrColors={false}
      enableClick={true}
      clickFunction={setSelectedTime}
      enableLegend={false}
      enableArea={true}
      stacked={true}
    />
  )
}

export default DelegateWeightsLineChart
