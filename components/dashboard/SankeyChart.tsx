import { useState, useEffect } from 'react'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { ResponsiveSankey } from '@nivo/sankey'
import {
  Card,
  Skeleton,
  useTheme,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material'
import { Fullscreen, FullscreenExit } from '@mui/icons-material'

import InfoTooltip from './InfoTooltip'
import styles from '../../styles/Home.module.css'
import { kFormatter } from '../../lib/helpers'
import getTheme from '../../lib/nivo/theme'
import { mkrPalette } from '../../lib/nivo/colors'
import { DelegateBalance } from '../../lib/types/delegate'

type Props = {
  data: { nodes: any[]; links: any[] } | undefined
  recognizedDelegates: DelegateBalance[] | undefined
}

const SankeyChart = ({ data, recognizedDelegates }: Props): JSX.Element => {
  const theme = useTheme()
  const handle = useFullScreenHandle()
  const [chartData, setChartData] = useState<
    { nodes: any[]; links: any[] } | undefined
  >()
  const [isFiltered, setIsFiltered] = useState<boolean>(false)

  useEffect(() => {
    setChartData(data)
  }, [data])

  return (
    <FullScreen handle={handle} className={styles.tableCard}>
      <Box
        sx={{
          height: '100%',
          p: handle.active ? 2 : 0,
          bgcolor: handle.active
            ? (theme) => theme.palette.background.default
            : '',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            component='h3'
            variant='h6'
            gutterBottom
            sx={{ color: (theme) => theme.palette.text.primary }}
          >
            MKR delegation
            <InfoTooltip text='Click on a delegator or delegate to render the specific chart' />
          </Typography>
          <Box>
            {isFiltered && (
              <Button
                size='small'
                variant='outlined'
                sx={{ py: 0 }}
                onClick={() => {
                  setChartData(data)
                  setIsFiltered(false)
                }}
              >
                Reset View
              </Button>
            )}
            <IconButton onClick={handle.active ? handle.exit : handle.enter}>
              {handle.active ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Box>
        </Box>
        <Card className={styles.pieChartContainer}>
          {!chartData || !recognizedDelegates ? (
            <Skeleton
              variant='rectangular'
              height={'calc(100% - 1.7em)'}
              sx={{ mt: '1.7em' }}
              animation='wave'
            />
          ) : (
            <ResponsiveSankey
              data={chartData}
              valueFormat={(value) => kFormatter(+value, 2)}
              margin={{ top: 7, bottom: 7, left: 7, right: 7 }}
              linkOpacity={theme.palette.mode === 'dark' ? 0.4 : 0.6}
              linkHoverOthersOpacity={0.1}
              linkContract={3}
              enableLinkGradient
              linkBlendMode={
                theme.palette.mode === 'dark' ? 'lighten' : 'multiply'
              }
              nodeThickness={12}
              nodeOpacity={1}
              nodeHoverOthersOpacity={0.35}
              nodeBorderWidth={3}
              nodeBorderRadius={1}
              nodeBorderColor={{
                from: 'color',
                modifiers: [],
              }}
              labelTextColor={{
                from: 'color',
                modifiers: [
                  theme.palette.mode === 'dark'
                    ? ['brighter', 0.2]
                    : ['darker', 1.5],
                ],
              }}
              theme={{ ...getTheme(theme), fontSize: handle.active ? 15 : 11 }}
              colors={mkrPalette}
              label={({ id: nodeId, ...props }) => {
                if (nodeId === 'others') {
                  if (props.sourceLinks.length > 1) return 'others'
                  else {
                    const delegateDelegators =
                      recognizedDelegates.find(
                        (del) =>
                          del.voteDelegate.toLowerCase() ===
                          props.sourceLinks[0].target.id.toLowerCase()
                      )?.delegatorCount || 0

                    const otherDelegators =
                      delegateDelegators === 0
                        ? 0
                        : delegateDelegators +
                          1 -
                          props.sourceLinks[0].target.targetLinks.length

                    return `others (${otherDelegators} delegators)`
                  }
                } else
                  return (
                    recognizedDelegates.find(
                      (del) =>
                        del.voteDelegate.toLowerCase() === nodeId.toLowerCase()
                    )?.name ||
                    (nodeId.length !== 42
                      ? nodeId
                      : nodeId.slice(0, 8) + '...' + nodeId.slice(-4))
                  )
              }}
              nodeTooltip={({ node }) => (
                <Card className={styles.chartTooltip}>
                  <span
                    className={styles.tooltipCircle}
                    style={{ backgroundColor: node.color }}
                  ></span>
                  <span>
                    {node.id.length === 42 && node.id.startsWith('0x')
                      ? node.id.slice(0, 8) + '...' + node.id.slice(-4)
                      : node.id}
                    : <b>{node.formattedValue}</b>
                  </span>
                </Card>
              )}
              onClick={(target) => {
                // @ts-ignore
                const id = target.id
                if (id) {
                  setChartData({
                    // @ts-ignore
                    nodes: data.nodes.filter((node) =>
                      // @ts-ignore
                      data.links
                        .filter(
                          (link) => link.source === id || link.target === id
                        )
                        .some(
                          (link) =>
                            link.source === node.id || link.target === node.id
                        )
                    ),
                    // @ts-ignore
                    links: data.links.filter(
                      (link) => link.source === id || link.target === id
                    ),
                  })
                  setIsFiltered(true)
                }
              }}
            />
          )}
        </Card>
      </Box>
    </FullScreen>
  )
}

export default SankeyChart
