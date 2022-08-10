import {
  Card,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  TableCellProps,
  Tooltip,
} from '@mui/material'
import { AccessTime as AcessTimeIcon } from '@mui/icons-material'

import { Proposal } from '../../lib/types/tracker'
import { calculateTimeDiff } from '../../lib/helpers'

import StatusTag from './StatusTag'
import ArchivedStatusTag from './ArchivedStatusTag'
import ImpactTag from './ImpactTag'
import ProposalIcons from './ProposalIcons'
import Loading from '../Loading'

const TableHeadCell = ({ align, children }: TableCellProps) => (
  <TableCell
    align={align}
    sx={{
      textTransform: 'capitalize',
      fontWeight: 'bold',
      backgroundColor: (theme) =>
        theme.palette.mode === 'light' ? '#FFFFFF' : '#1E1E1E',
    }}
  >
    {children}
  </TableCell>
)

type Props = {
  proposals: Proposal[] | undefined
  title: string
  archiveTable?: boolean
  activeTable?: boolean
  impactTable?: boolean
  timeTable?: boolean
}

const ExecutiveTable = ({
  proposals,
  title,
  archiveTable = false,
  activeTable = false,
  impactTable = false,
  timeTable = false,
}: Props): JSX.Element => {
  const layout = archiveTable
    ? ['10%', '15%', '15%', '10%', '40%', '10%']
    : impactTable
    ? ['10%', '10', '10%', '20%', '40%', '10%']
    : ['10%', '10%', '15%', '10%', '45%', '10%']

  return (
    <>
      <Typography
        variant='h5'
        sx={{ color: (theme) => theme.palette.text.primary }}
      >
        {title}
      </Typography>
      {Array.isArray(proposals) && proposals.length === 0 ? (
        <Typography
          variant='h6'
          sx={{ color: (theme) => theme.palette.text.primary }}
        >
          No active or pending {title.toLocaleLowerCase()} at the moment
        </Typography>
      ) : (
        <Card>
          <TableContainer sx={{ maxHeight: '100%' }}>
            <Table stickyHeader size='small' aria-label={`${title} table`}>
              <colgroup>
                {layout.map((width, i) => (
                  <col key={i} style={{ width }} />
                ))}
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableHeadCell align='center'>
                    {archiveTable ? 'End Date' : 'Time Left'}
                  </TableHeadCell>
                  {impactTable && (
                    <TableHeadCell align='center'>Type</TableHeadCell>
                  )}
                  <TableHeadCell align='center'>
                    {activeTable || timeTable ? 'Type' : 'Status'}
                  </TableHeadCell>
                  <TableHeadCell align='center'>Class</TableHeadCell>
                  {!impactTable && (
                    <TableHeadCell align='center'>Impact</TableHeadCell>
                  )}
                  <TableHeadCell align='center'>Item</TableHeadCell>
                  <TableHeadCell align='center'>Links</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!proposals
                  ? Array.from(Array(11).keys()).map((key) => (
                      <TableRow key={key}>
                        {Array.from(Array(6).keys()).map((k) => (
                          <TableCell key={k}>
                            <Loading height={28} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : proposals.map((proposal, i) => (
                      <TableRow hover key={i}>
                        <TableCell align='center'>
                          {archiveTable
                            ? new Date(proposal.endDate).toLocaleDateString()
                            : proposal.endDate && (
                                <>
                                  {calculateTimeDiff(
                                    Date.parse(proposal.endDate.toString())
                                  )}
                                  <Tooltip
                                    title={new Date(
                                      proposal.endDate
                                    ).toLocaleString()}
                                    sx={{ fontSize: '12px', marginLeft: '3px' }}
                                  >
                                    <AcessTimeIcon fontSize='inherit' />
                                  </Tooltip>
                                </>
                              )}
                        </TableCell>
                        {impactTable && (
                          <TableCell align='center'>{proposal.type}</TableCell>
                        )}
                        <TableCell align='center'>
                          {activeTable || timeTable ? (
                            proposal.type
                          ) : archiveTable ? (
                            <ArchivedStatusTag status={proposal.status} />
                          ) : (
                            <StatusTag
                              status={proposal.activityStatus || 'Active'}
                            />
                          )}
                        </TableCell>
                        <TableCell align='center'>{proposal.class}</TableCell>
                        {!impactTable && (
                          <TableCell align='center'>
                            {proposal.impact && (
                              <ImpactTag impact={proposal.impact} />
                            )}
                          </TableCell>
                        )}
                        <TableCell align='left'>{proposal.title}</TableCell>
                        <TableCell align='center'>
                          <ProposalIcons proposal={proposal} />
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </>
  )
}

export default ExecutiveTable
