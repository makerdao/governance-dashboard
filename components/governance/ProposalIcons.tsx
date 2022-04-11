import { IconButton } from '@mui/material'
import {
  Forum as ForumIcon,
  Ballot as BallotIcon,
  Gavel as GavelIcon,
} from '@mui/icons-material'

import { ExecutiveProposal } from '../../lib/types/tracker'

enum IconType {
  forum = 'forum',
  poll = 'poll',
  executive = 'executive',
}

type FormattedIconButtonProps = {
  href: string
  type: IconType
}

const FormattedIconButton = ({ type, href }: FormattedIconButtonProps) => (
  <IconButton size='small' color='primary' target='_blank' href={href}>
    {type === 'forum' ? (
      <ForumIcon fontSize='inherit' />
    ) : type === 'poll' ? (
      <BallotIcon fontSize='inherit' />
    ) : (
      <GavelIcon fontSize='inherit' />
    )}
  </IconButton>
)

type Props = {
  proposal: ExecutiveProposal
}

const ProposalIcons = ({ proposal }: Props) => {
  return (
    <>
      {proposal.forum && (
        <FormattedIconButton href={proposal.forum} type={IconType.forum} />
      )}
      {proposal.poll && (
        <FormattedIconButton href={proposal.poll} type={IconType.poll} />
      )}
      {proposal.executive && (
        <FormattedIconButton
          href={proposal.executive}
          type={IconType.executive}
        />
      )}
    </>
  )
}

export default ProposalIcons
