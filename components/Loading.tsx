import { Skeleton } from '@mui/material'

type Props = {
  count?: number
  height?: number | string
}

const Loading = ({ count = 1, height = 55 }: Props) => (
  <>
    {Array.from(Array(count).keys()).map((key) => (
      <Skeleton animation='wave' key={key} height={height} />
    ))}
  </>
)

export default Loading
