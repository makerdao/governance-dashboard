import { MouseEvent, useState, Dispatch, SetStateAction } from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  FormGroup,
  FormLabel,
  FormControlLabel,
  Switch,
  Box,
} from '@mui/material'
import { Settings as SettingsIcon } from '@mui/icons-material'

import { useDashboard } from '../../context/DashboardContext'
import AutocompleteDateInput from './AutocompleteDateInput'
import AutocompleteInput from './AutocompleteInput'
import { UserBalances } from '../../lib/types/delegate'

type Props = {
  mkrBalancesData: UserBalances[] | undefined
}

const DashboardMoreMenu = ({ mkrBalancesData }: Props) => {
  const {
    showExpiredDelegates,
    setShowExpiredDelegates,
    selectedStartDate,
    setSelectedStartDate,
    selectedEndDate,
    setSelectedEndDate,
  } = useDashboard()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const moreOptionsOpen = Boolean(anchorEl)

  const handleMoreOptionsOpen = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleMoreOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleCheck = () => {
    setShowExpiredDelegates((prevState) => !prevState)
  }

  return (
    <Box
      sx={{
        gridColumn: 'span 12',
        gridRow: 'span 1',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <AutocompleteDateInput
        label='Start date'
        mkrBalancesData={mkrBalancesData}
        selectedDate={selectedStartDate}
        setSelectedDate={setSelectedStartDate}
      />
      <AutocompleteDateInput
        label='End date'
        mkrBalancesData={mkrBalancesData}
        selectedDate={selectedEndDate}
        setSelectedDate={setSelectedEndDate}
      />
      <AutocompleteInput mkrBalancesData={mkrBalancesData} />
      <IconButton onClick={handleMoreOptionsOpen}>
        <SettingsIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={moreOptionsOpen}
        onClose={handleMoreOptionsClose}
      >
        <MenuItem>
          <FormControl>
            <FormLabel component='legend'>Expired delegates</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={showExpiredDelegates}
                    onChange={handleCheck}
                  />
                }
                label={showExpiredDelegates ? 'Shown' : 'Hidden'}
              />
            </FormGroup>
          </FormControl>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default DashboardMoreMenu
