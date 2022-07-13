import {
  Typography,
  Box,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableCellProps,
  TableBody,
} from '@mui/material'
import { CallMade } from '@mui/icons-material'
import Link from 'next/link'

import { useDelegates } from '../../context/DelegatesContext'
import Loading from '../../components/Loading'

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

const DelegatesPage = () => {
  const { delegatesData } = useDelegates()

  return (
    <Box sx={{ height: '100%' }}>
      <Typography
        variant='h5'
        sx={{ color: (theme) => theme.palette.text.primary, mb: 2 }}
      >
        Delegate metrics
      </Typography>
      <Card sx={{ height: 'calc(100% - 48px)' }}>
        <TableContainer sx={{ maxHeight: '100%' }}>
          <Table stickyHeader aria-label='delegate metrics table'>
            <TableHead>
              <TableRow>
                <TableHeadCell align='center'>Delegate</TableHeadCell>
                <TableHeadCell align='center'>Delegated MKR</TableHeadCell>
                <TableHeadCell align='center'>Participation</TableHeadCell>
                <TableHeadCell align='center'>Communication</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!delegatesData.length
                ? Array.from(Array(11).keys()).map((key) => (
                    <TableRow key={key}>
                      {Array.from(Array(4).keys()).map((k) => (
                        <TableCell key={k}>
                          <Loading height={40} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : delegatesData.map((delegate) => (
                    <TableRow hover key={delegate.voteDelegateAddress}>
                      <Link
                        href={`/delegates/${delegate.voteDelegateAddress}`}
                        passHref
                      >
                        <TableCell sx={{ cursor: 'pointer' }} align='center'>
                          {delegate.name}
                          <CallMade
                            sx={{
                              ml: 1,
                              color: (theme) => theme.palette.primary.main,
                            }}
                            fontSize='inherit'
                          />
                        </TableCell>
                      </Link>
                      <TableCell align='center'>
                        {delegate.mkrDelegated.toLocaleString()}
                      </TableCell>
                      <TableCell align='center'>
                        {delegate.combinedParticipation}
                      </TableCell>
                      <TableCell align='center'>
                        {delegate.communication}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}

export default DelegatesPage
