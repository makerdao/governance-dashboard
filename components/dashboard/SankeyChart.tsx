import { useState, useEffect } from 'react'
import { ResponsiveSankey } from '@nivo/sankey'
import {
  Card,
  Skeleton,
  useTheme,
  Typography,
  Button,
  Box,
} from '@mui/material'

import InfoTooltip from '../InfoTooltip'
import styles from '../../styles/Home.module.css'
import { kFormatter } from '../../lib/helpers'
import getTheme from '../../lib/nivo/theme'
import { mkrPalette } from '../../lib/nivo/colors'
import { DelegateBalance } from '../../lib/types/delegate'

type Props = {
  title: string
  data: { nodes: any[]; links: any[] } | undefined
  infoTooltipText?: string
  recognizedDelegates: DelegateBalance[] | undefined
}

const SankeyChart = ({
  title,
  data,
  infoTooltipText,
  recognizedDelegates,
}: Props): JSX.Element => {
  const theme = useTheme()
  const [chartData, setChartData] = useState<
    { nodes: any[]; links: any[] } | undefined
  >()
  const [isFiltered, setIsFiltered] = useState<boolean>(false)

  useEffect(() => {
    setChartData(data)
  }, [data])

  return (
    <div className={styles.chartCard}>
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
          {title}{' '}
          {infoTooltipText ? <InfoTooltip text={infoTooltipText} /> : ''}
        </Typography>
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
            theme={getTheme(theme)}
            colors={mkrPalette}
            label={({ id: nodeId }) =>
              recognizedDelegates.find(
                (del) => del.voteDelegate.toLowerCase() === nodeId.toLowerCase()
              )?.name ||
              (nodeId.length !== 42
                ? nodeId
                : nodeId.slice(0, 8) + '...' + nodeId.slice(-4))
            }
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
    </div>
  )
}

export default SankeyChart
