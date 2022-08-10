import { NextApiRequest, NextApiResponse } from 'next'

const getForumComments = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { delegate } = req.query

    const votingPortalRes = await fetch(
      `https://vote.makerdao.com/api/comments/${delegate}`
    )
    if (votingPortalRes.status !== 200)
      throw 'There was an error while fetching the voting portal'

    const votingPortalResBody = await votingPortalRes.json()
    const voteComments = votingPortalResBody.comments
      .slice(0, 30)
      .map(({ comment, address }: { comment: any; address: any }) => ({
        commentType: 'onChain',
        voteType: comment.pollId ? 'Poll' : 'Executive',
        id: comment.pollId || comment.spellAddress,
        username: address.delegateInfo.name,
        comment: comment.comment,
        date: comment.date,
        url: `https://vote.makerdao.com/${
          comment.pollId ? 'polling' : 'executive'
        }/${comment.pollId || comment.spellAddress}#comments`,
        avatarUrl: address.delegateInfo.picture,
      }))

    res.status(200).json(voteComments)
  } catch (err) {
    res.status(500).json({ success: false, err })
  }
}

export default getForumComments
