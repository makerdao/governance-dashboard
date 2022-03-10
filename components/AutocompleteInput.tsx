import { Dispatch, SetStateAction } from 'react'
import { Autocomplete, TextField } from '@mui/material'

import { UserBalances } from '../lib/types/delegate'

type Props = {
  mkrBalancesData: void | UserBalances[] | undefined
  selectedAddress: string | null
  setSelectedAddress: Dispatch<SetStateAction<string | null>>
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
      size='small'
      renderInput={(params) => <TextField {...params} label='Address' />}
    />
  )
}

export default AutocompleteInput
