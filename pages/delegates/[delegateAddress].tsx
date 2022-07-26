import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Link from 'next/link'
import { useState } from 'react'
import {
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Avatar,
  Divider,
  Link as MuiLink,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import { ArrowBack, CallMade } from '@mui/icons-material'
import { sanitize } from 'dompurify'

import { useDelegates, ProposalComment } from '../../context/DelegatesContext'
import DelegateCommentLoading from '../../components/DelegateCommentLoading'
import SearchInput from '../../components/SearchInput'

const DelegateProfilePage = () => {
  const [mainSearch, setMainSearch] = useState<string>('')
  const [selectedCommentType, setSelectedCommentType] = useState<
    'forum' | 'onChain' | 'all'
  >('all')

  const router = useRouter()
  const { delegateAddress } = router.query

  const { delegatesData, fetchComments } = useDelegates()
  const delegate = delegatesData.find(
    (del) => del.voteDelegateAddress === delegateAddress
  )

  if (!delegatesData.length) return null
  if (!delegate)
    return (
      <ErrorPage statusCode={404} title='Error fetching delegate information' />
    )

  if (!delegate.comments)
    fetchComments(delegate.name, delegate.voteDelegateAddress)

  const filterComments = (comment: ProposalComment) =>
    selectedCommentType === 'all'
      ? true
      : comment.commentType === selectedCommentType

  const filterSearch = (comment: ProposalComment) =>
    mainSearch === ''
      ? true
      : comment.comment.toLowerCase().includes(mainSearch.toLowerCase()) ||
        (comment.commentType === 'onChain' &&
          `${comment.voteType} ${comment.id}`
            .toLowerCase()
            .includes(mainSearch.toLowerCase())) ||
        new Date(comment.date)
          .toDateString()
          .toLowerCase()
          .includes(mainSearch.toLowerCase())

  const filteredDelegateComments =
    delegate?.comments?.filter(filterComments).filter(filterSearch) || []

  return (
    <Box sx={{ height: '100%' }}>
      <Typography
        variant='h5'
        sx={{ color: (theme) => theme.palette.text.primary, mb: 1 }}
      >
        <Link href='/delegates' passHref>
          <IconButton
            sx={{ mr: 0.5, color: (theme) => theme.palette.text.primary }}
          >
            <ArrowBack />
          </IconButton>
        </Link>
        {delegate.name}
      </Typography>
      <Box sx={{ height: 'calc(100% - 48px)', display: 'flex', gap: 1 }}>
        <Box sx={{ flexBasis: '20%', alignSelf: 'flex-start' }}>
          <Typography
            variant='h6'
            sx={{
              color: (theme) => theme.palette.text.primary,
              mt: 0.5,
              mb: 1.5,
              px: 2,
            }}
          >
            Stats
          </Typography>
          <Card>
            <CardContent>
              <Box m={1}>
                <Typography fontWeight='bold' fontSize='1.3em'>
                  {delegate.mkrDelegated.toLocaleString()}
                </Typography>
                <Typography
                  sx={{ color: (theme) => theme.palette.text.secondary }}
                >
                  MKR delegated
                </Typography>
              </Box>
              <Box m={1}>
                <Typography fontWeight='bold' fontSize='1.3em'>
                  {delegate.pollParticipation}
                </Typography>
                <Typography
                  sx={{ color: (theme) => theme.palette.text.secondary }}
                >
                  Poll participation
                </Typography>
              </Box>
              <Box m={1}>
                <Typography fontWeight='bold' fontSize='1.3em'>
                  {delegate.executiveParticipation}
                </Typography>
                <Typography
                  sx={{ color: (theme) => theme.palette.text.secondary }}
                >
                  Executive participation
                </Typography>
              </Box>
              <Box m={1}>
                <Typography fontWeight='bold' fontSize='1.3em'>
                  {delegate.combinedParticipation}
                </Typography>
                <Typography
                  sx={{ color: (theme) => theme.palette.text.secondary }}
                >
                  Combined participation
                </Typography>
              </Box>
              <Box m={1}>
                <Typography fontWeight='bold' fontSize='1.3em'>
                  {delegate.communication}
                </Typography>
                <Typography
                  sx={{ color: (theme) => theme.palette.text.secondary }}
                >
                  Vote communication
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flexBasis: '80%' }}>
          <Box
            sx={{
              color: (theme) => theme.palette.text.primary,
              mb: 1,
              px: 3,
              display: 'flex',
              alignItems: 'baseline',
            }}
          >
            <Typography variant='h6' sx={{ flex: 1 }}>
              Comments
            </Typography>
            <Stack direction='row' spacing={1}>
              <SearchInput setMainSearch={setMainSearch} />
              <ToggleButtonGroup
                exclusive
                color='primary'
                size='small'
                value={selectedCommentType}
                onChange={(e, newType) =>
                  newType !== null && setSelectedCommentType(newType)
                }
              >
                <ToggleButton value='all' sx={{ fontWeight: 'bold' }}>
                  All
                </ToggleButton>
                <ToggleButton value='forum' sx={{ fontWeight: 'bold' }}>
                  Forum
                </ToggleButton>
                <ToggleButton value='onChain' sx={{ fontWeight: 'bold' }}>
                  On-chain
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Box>
          <Stack
            spacing={1.5}
            sx={{
              maxHeight: 'calc(100% - 40px)',
              overflowY: 'auto',
              fontSize: '0.9em',
              px: 1,
              pb: 1,
            }}
          >
            {!delegate.comments ? (
              <DelegateCommentLoading />
            ) : !filteredDelegateComments.length ? (
              <Typography
                fontSize={18}
                sx={{ color: (theme) => theme.palette.text.primary }}
              >
                No{' '}
                {selectedCommentType === 'all'
                  ? 'forum posts or on-chain comments'
                  : selectedCommentType === 'forum'
                  ? 'forum posts'
                  : 'on-chain comments'}{' '}
                found for this delegate
              </Typography>
            ) : (
              filteredDelegateComments.map((comment, idx) => (
                <Card
                  key={idx}
                  sx={{
                    flexShrink: 0,
                    pb: comment.commentType === 'forum' ? 0 : 1.5,
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{ bgcolor: '#1aab9b' }}
                        alt='Profile avatar'
                        src={comment.avatarUrl}
                      />
                    }
                    title={comment.username}
                    titleTypographyProps={{
                      fontSize: '1.4em',
                      fontWeight: 'bold',
                    }}
                    subheader={
                      <>
                        <MuiLink
                          href={comment.url}
                          underline='none'
                          target='_blank'
                        >
                          {comment.commentType === 'forum'
                            ? 'Forum post'
                            : 'On-chain comment'}{' '}
                          <CallMade fontSize='inherit' />
                        </MuiLink>{' '}
                        {comment.commentType === 'onChain'
                          ? `| ${comment.voteType} ${
                              typeof comment.id !== 'string'
                                ? comment.id
                                : comment.id.slice(0, 6) +
                                  '...' +
                                  comment.id.slice(-4)
                            } |`
                          : '|'}{' '}
                        {new Date(comment.date).toDateString()}
                      </>
                    }
                    subheaderTypographyProps={{ fontWeight: 'bold' }}
                  />
                  <Divider />
                  <CardContent
                    sx={{ pt: 0, py: '0.5em !important' }}
                    dangerouslySetInnerHTML={{
                      __html: sanitize(comment.comment),
                    }}
                  ></CardContent>
                </Card>
              ))
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default DelegateProfilePage
