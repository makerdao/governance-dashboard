import { useState, MouseEvent } from 'react'
import {
  Card,
  Skeleton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  Typography,
  TableCellProps,
} from '@mui/material'

import styles from '../../styles/Home.module.css'
import { ExecutiveProposal } from '../../lib/types/tracker'
import { calculateTimeDiff } from '../../lib/helpers'

import StatusTag from './StatusTag'
import ImpactTag from './ImpactTag'
import ProposalIcons from './ProposalIcons'

const TableHeadCell = ({ align, children }: TableCellProps) => (
  <TableCell
    align={align}
    style={{
      textTransform: 'capitalize',
      fontWeight: 'bold',
    }}
  >
    {children}
  </TableCell>
)

type Props = {
  proposals: ExecutiveProposal[]
  title: string
}

const ExecutiveTable = ({ proposals, title }: Props): JSX.Element => {
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = useState<'lockTotal' | 'delegatorCount'>(
    'lockTotal'
  )

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: 'lockTotal' | 'delegatorCount'
  ) => {
    const isAsc = orderBy === property && order === 'desc'
    setOrder(isAsc ? 'asc' : 'desc')
    setOrderBy(property)

    proposals?.sort((a, b) =>
      // @ts-ignore
      isAsc ? a[property] - b[property] : b[property] - a[property]
    )
  }

  const handleSort =
    (property: 'lockTotal' | 'delegatorCount') =>
    (event: MouseEvent<unknown>) => {
      handleRequestSort(event, property)
    }

  return (
    <Card className={styles.proposalTableCard}>
      <Typography variant='h5'>{title}</Typography>
      {!proposals ? (
        <>
          <Skeleton animation='wave' height={55} />
          <Skeleton animation='wave' height={55} />
          <Skeleton animation='wave' height={55} />
          <Skeleton animation='wave' height={55} />
          <Skeleton animation='wave' height={55} />
        </>
      ) : !proposals.length ? (
        <Typography>
          No active {title.toLocaleLowerCase()} at this moment
        </Typography>
      ) : (
        <TableContainer sx={{ maxHeight: 'calc(45vh - 64px)' }}>
          <Table stickyHeader size='small' aria-label={`${title} table`}>
            <TableHead>
              <TableRow>
                <TableHeadCell align='center'>Item</TableHeadCell>
                <TableHeadCell align='center'>Class</TableHeadCell>
                <TableHeadCell align='center'>
                  <TableSortLabel
                    active={orderBy === 'lockTotal'}
                    direction={orderBy === 'lockTotal' ? order : 'desc'}
                    onClick={handleSort('lockTotal')}
                  >
                    Impact
                  </TableSortLabel>
                </TableHeadCell>
                <TableHeadCell align='center'>
                  <TableSortLabel
                    active={orderBy === 'lockTotal'}
                    direction={orderBy === 'lockTotal' ? order : 'desc'}
                    onClick={handleSort('lockTotal')}
                  >
                    Time Left
                  </TableSortLabel>
                </TableHeadCell>
                <TableHeadCell align='center'>Links</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proposals.map((proposal, i) => (
                <TableRow hover key={i}>
                  <TableCell align='left'>
                    <StatusTag status={proposal.activityStatus || 'Active'} />
                    {proposal.title}
                  </TableCell>
                  <TableCell align='center'>{proposal.class}</TableCell>
                  <TableCell align='center'>
                    {proposal.impact && <ImpactTag impact={proposal.impact} />}
                  </TableCell>
                  <TableCell align='center'>
                    {calculateTimeDiff(
                      Date.parse(proposal.endDate?.toString())
                    )}
                  </TableCell>
                  <TableCell align='center'>
                    <ProposalIcons proposal={proposal} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Card>
  )
}

export default ExecutiveTable
