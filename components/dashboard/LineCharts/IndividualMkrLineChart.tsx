import { useDashboard } from '../../../context/DashboardContext'
import { UserBalances } from '../../../lib/types/delegate'
import LineChart from './LineChart'

type Props = {
  data: UserBalances[] | undefined
}

const IndividualMkrLineChart = ({ data: mkrBalancesData }: Props) => {
  const { selectedAddress, selectedDelegate } = useDashboard()

  return (
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
  )
}

export default IndividualMkrLineChart
