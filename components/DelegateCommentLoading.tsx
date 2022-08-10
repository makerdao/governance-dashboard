import { Skeleton, Card, CardHeader, CardContent, Divider } from '@mui/material'

const DelegateCommentLoading = () => (
  <>
    {Array.from(Array(3).keys()).map((key) => (
      <Card key={key} sx={{ flexShrink: 0 }}>
        <CardHeader
          avatar={
            <Skeleton
              animation='wave'
              variant='circular'
              width={40}
              height={40}
            />
          }
          title={<Skeleton animation='wave' width={300} height={35} />}
          subheader={<Skeleton animation='wave' width={500} />}
        />
        <Divider />
        <CardContent>
          <Skeleton animation='wave' height={30} />
          <Skeleton animation='wave' height={30} />
          <Skeleton animation='wave' height={30} />
        </CardContent>
      </Card>
    ))}
  </>
)

export default DelegateCommentLoading
