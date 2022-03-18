import { Tooltip } from '@mui/material'
import { Help as HelpIcon } from '@mui/icons-material'

type Props = {
  text: string
}

const InfoTooltip = ({ text }: Props) => {
  return (
    <Tooltip title={text}>
      <HelpIcon color='disabled' fontSize='small' />
    </Tooltip>
  )
}

export default InfoTooltip
