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
  IconButton,
} from '@mui/material'
import { CallMade } from '@mui/icons-material'
import { DelegateBalance } from '../lib/types/delegate'

import styles from '../styles/Home.module.css'

type Props = {
  title: string
  delegates: DelegateBalance[] | undefined
  setSelectedAddress: (address: string | null, delegate?: string) => void
}

const TableCard = ({
  title,
  delegates,
  setSelectedAddress,
}: Props): JSX.Element => {
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

    delegates?.sort((a, b) =>
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
    <Card className={styles.tableCard}>
      <h3>{title}</h3>
      {!delegates ? (
        <>
          <Skeleton animation='wave' height={65} />
          <Skeleton animation='wave' height={65} />
          <Skeleton animation='wave' height={65} />
          <Skeleton animation='wave' height={65} />
          <Skeleton animation='wave' height={65} />
        </>
      ) : (
        <TableContainer sx={{ maxHeight: 'calc(100% - 50px)' }}>
          <Table stickyHeader size='small' aria-label={`${title} table`}>
            <TableHead>
              <TableRow>
                <TableCell
                  align='center'
                  style={{
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                  }}
                >
                  Delegate
                </TableCell>
                <TableCell
                  align='center'
                  style={{
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                  }}
                >
                  <TableSortLabel
                    active={orderBy === 'delegatorCount'}
                    direction={orderBy === 'delegatorCount' ? order : 'desc'}
                    onClick={handleSort('delegatorCount')}
                  >
                    Delegators
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align='center'
                  style={{
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                  }}
                >
                  <TableSortLabel
                    active={orderBy === 'lockTotal'}
                    direction={orderBy === 'lockTotal' ? order : 'desc'}
                    onClick={handleSort('lockTotal')}
                  >
                    MKR Delegated
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {delegates.map((delegate, i) => (
                <TableRow hover key={i}>
                  <TableCell align='left'>
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        setSelectedAddress(delegate.voteDelegate, delegate.name)
                      }
                    >
                      {delegate.name ||
                        delegate.voteDelegate.slice(0, 8) +
                          '...' +
                          delegate.voteDelegate.slice(38)}
                    </span>
                    <IconButton
                      size='small'
                      color='primary'
                      aria-label='Etherscan delegate link'
                      href={`https://etherscan.io/address/${delegate.voteDelegate}`}
                      target='_blank'
                    >
                      <CallMade fontSize='inherit' />
                    </IconButton>
                  </TableCell>
                  <TableCell align='center'>
                    {delegate.delegatorCount}
                  </TableCell>
                  <TableCell align='center'>
                    {(+parseFloat(delegate.lockTotal).toFixed(
                      2
                    )).toLocaleString('en-US')}
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

export default TableCard
