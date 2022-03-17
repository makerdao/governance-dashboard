import { Autocomplete, TextField } from '@mui/material'

import { UserBalances } from '../lib/types/delegate'

type Props = {
  mkrBalancesData: void | UserBalances[] | undefined
  selectedAddress: string | null
  setSelectedAddress: (address: string | null, delegate?: string) => void
}

const AutocompleteInput = ({
  mkrBalancesData,
  selectedAddress,
  setSelectedAddress,
}: Props): JSX.Element => {
  return (
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
  )
}

export default AutocompleteInput
