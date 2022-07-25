import { useState, MouseEvent } from 'react'
import {
  Card,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  TableCellProps,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material'
import { CallMade, InfoOutlined, WarningAmber } from '@mui/icons-material'

import { useDashboard } from '../../context/DashboardContext'
import { DelegateBalance } from '../../lib/types/delegate'
import styles from '../../styles/Home.module.css'
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
  title: string
  delegates: DelegateBalance[] | undefined
}

const TableCard = ({ title, delegates }: Props): JSX.Element => {
  const { showExpiredDelegates, handleSelectDelegate: setSelectedAddress } =
    useDashboard()
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
    <div className={styles.tableCard}>
      <Typography
        component='h3'
        variant='h6'
        gutterBottom
        sx={{ color: (theme) => theme.palette.text.primary }}
      >
        {title}
      </Typography>
      <Card sx={{ height: 'calc(100% - 39px)' }}>
        <TableContainer sx={{ maxHeight: '100%' }}>
          <Table stickyHeader size='small' aria-label={`${title} table`}>
            <colgroup>
              <col style={{ width: '50%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '25%' }} />
            </colgroup>
            <TableHead>
              <TableRow>
                <TableHeadCell align='center'>Delegate</TableHeadCell>
                <TableHeadCell align='center'>
                  <TableSortLabel
                    active={orderBy === 'delegatorCount'}
                    direction={orderBy === 'delegatorCount' ? order : 'desc'}
                    onClick={handleSort('delegatorCount')}
                  >
                    Delegators
                  </TableSortLabel>
                </TableHeadCell>
                <TableHeadCell align='center'>
                  <TableSortLabel
                    active={orderBy === 'lockTotal'}
                    direction={orderBy === 'lockTotal' ? order : 'desc'}
                    onClick={handleSort('lockTotal')}
                  >
                    MKR Delegated
                  </TableSortLabel>
                </TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!delegates
                ? Array.from(Array(8).keys()).map((key) => (
                    <TableRow key={key}>
                      {Array.from(Array(3).keys()).map((k) => (
                        <TableCell key={k}>
                          <Loading height={28} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : delegates
                    .filter((delegate) =>
                      showExpiredDelegates
                        ? true
                        : delegate.status !== 'expired'
                    )
                    .map((delegate, i) => (
                      <TableRow hover key={i}>
                        <TableCell align='left'>
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              setSelectedAddress(
                                delegate.voteDelegate,
                                delegate.name
                              )
                            }
                          >
                            {delegate.name ||
                              delegate.voteDelegate.slice(0, 8) +
                                '...' +
                                delegate.voteDelegate.slice(38)}
                          </span>
                          {delegate.expired && (
                            <IconButton
                              size='small'
                              color='error'
                              aria-label='Expiration warning tooltip icon'
                              disableRipple
                              edge='end'
                              sx={{ cursor: 'default' }}
                            >
                              <Tooltip title='This delegate contract has expired, if you delegate to this contract, please consider migrating your MKR to the new ones'>
                                <WarningAmber fontSize='inherit' />
                              </Tooltip>
                            </IconButton>
                          )}
                          {delegate.isAboutToExpire && !delegate.expired && (
                            <IconButton
                              size='small'
                              color='secondary'
                              aria-label='Expiration info tooltip icon'
                              disableRipple
                              edge='end'
                              sx={{ cursor: 'default' }}
                            >
                              <Tooltip title='This delegate contract is about to expire, if you delegate to this contract, please consider migrating your MKR to the new ones'>
                                <InfoOutlined fontSize='inherit' />
                              </Tooltip>
                            </IconButton>
                          )}
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
                          {(+delegate.lockTotal > 999
                            ? parseInt(delegate.lockTotal)
                            : +parseFloat(delegate.lockTotal).toFixed(2)
                          ).toLocaleString('en-US')}
                        </TableCell>
                      </TableRow>
                    ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  )
}

export default TableCard
