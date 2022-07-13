import { useState, ChangeEvent } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { Search } from '@mui/icons-material'

type Props = {
  setMainSearch: (searchParam: string) => void
}

const SearchInput = ({ setMainSearch }: Props) => {
  const [searchValue, setSearchValue] = useState<string>('')

  return (
    <TextField
      size='small'
      label='Search...'
      sx={{ width: 200 }}
      value={searchValue}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        setSearchValue(e.target.value)
      }
      onKeyDown={(e) => e.key === 'Enter' && setMainSearch(searchValue)}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              type='submit'
              onClick={() => setMainSearch(searchValue)}
              edge='end'
            >
              <Search fontSize='small' />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}

export default SearchInput
