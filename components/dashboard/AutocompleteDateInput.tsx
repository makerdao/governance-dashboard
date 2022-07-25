import { Autocomplete, TextField } from '@mui/material'

import { UserBalances } from '../../lib/types/delegate'

type Props = {
  mkrBalancesData: void | UserBalances[] | undefined
  selectedDate: string | null
  setSelectedDate: (date: string | null) => void
  label: string
}

const AutocompleteDateInput = ({
  mkrBalancesData,
  selectedDate,
  setSelectedDate,
  label,
}: Props): JSX.Element => {
  const startIndex = label === 'Start date' ? 0 : 1
  const endIndex = label === 'Start date' ? -1 : undefined

  const dateData = Array.from(
    new Set(mkrBalancesData?.map((entry) => entry.time.toLocaleDateString()))
  ).slice(startIndex, endIndex)

  return (
    <Autocomplete
      value={selectedDate}
      onChange={(event: any, newDate: string | null) => {
        setSelectedDate(newDate)
      }}
      options={dateData || []}
      sx={{ width: 155 }}
      clearOnEscape
      size='small'
      renderInput={(params) => <TextField {...params} label={label} />}
      renderOption={(props, option) => <li {...props}>{option}</li>}
    />
  )
}

export default AutocompleteDateInput
