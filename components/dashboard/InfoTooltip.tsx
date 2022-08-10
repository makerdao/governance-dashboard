import { Tooltip, IconButton } from '@mui/material'
import { Help as HelpIcon } from '@mui/icons-material'

type Props = {
  text: string
}

const InfoTooltip = ({ text }: Props) => {
  return (
    <IconButton
      size='small'
      disableRipple
      edge='end'
      sx={{ cursor: 'default' }}
    >
      <Tooltip title={text}>
        <HelpIcon color='disabled' fontSize='small' />
      </Tooltip>
    </IconButton>
  )
}

export default InfoTooltip
