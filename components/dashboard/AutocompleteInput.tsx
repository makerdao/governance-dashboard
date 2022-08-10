import { useMemo } from 'react'
import { Autocomplete, TextField } from '@mui/material'

import { useDashboard } from '../../context/DashboardContext'
import { UserBalances } from '../../lib/types/delegate'

type Props = {
  mkrBalancesData: UserBalances[] | undefined
}

const AutocompleteInput = ({ mkrBalancesData }: Props): JSX.Element => {
  const { selectedAddress, handleSelectDelegate: setSelectedAddress } =
    useDashboard()

  return useMemo(
    () => (
      <Autocomplete
        value={selectedAddress}
        onChange={(event: any, newAddress: string | null) => {
          setSelectedAddress(newAddress)
        }}
        options={
          mkrBalancesData
            ? mkrBalancesData[mkrBalancesData.length - 1].balances.map(
                (bal) => bal.sender
              )
            : []
        }
        sx={{ width: 200 }}
        clearOnEscape
        size='small'
        renderInput={(params) => <TextField {...params} label='Address' />}
        renderOption={(props, option) => (
          <li {...props}>{option.slice(0, 12) + '...' + option.slice(38)}</li>
        )}
      />
    ),
    [mkrBalancesData, selectedAddress, setSelectedAddress]
  )
}

export default AutocompleteInput
