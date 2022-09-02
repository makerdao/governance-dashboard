import { NextApiRequest, NextApiResponse } from 'next'

import { DELEGATE_PLATFORMS } from '../../../../lib/constants'

const getForumComments = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { delegate } = req.query
    const delegatePlatform = DELEGATE_PLATFORMS.find(
      (entry) => entry.name === delegate
    )
    if (!delegatePlatform)
      throw 'Unable to find a delegate platform forum topic for the delegate name provided'

    const topicForumRes = await fetch(delegatePlatform.platform + '.json')
    if (topicForumRes.status !== 200)
      throw topicForumRes
    if (topicForumRes.status !== 200)
      throw 'There was an error while fetching the forum topic'

    const topicForumResBody = await topicForumRes.json()
    const postStream = topicForumResBody.post_stream.stream.slice(-60)

    const postUrlParams = postStream
      .map((id: number) => `post_ids%5B%5D=${id}`)
      .join('&')

    const postsForumRes = await fetch(
      `https://forum.makerdao.com/t/${topicForumResBody.id}/posts.json?${postUrlParams}`
    )
    if (postsForumRes.status !== 200) return

    const postsForumResBody = await postsForumRes.json()

    const forumComments = postsForumResBody.post_stream.posts
      .filter((post: any) => delegatePlatform.members.includes(post.username))
      .map((post: any) => ({
        commentType: 'forum',
        username: post.username,
        comment: post.cooked,
        date: post.created_at,
        url: `https://forum.makerdao.com/p/${post.id}`,
        avatarUrl: `https://forum.makerdao.com${post.avatar_template.replace(
          '{size}',
          '45'
        )}`,
      }))

    res.status(200).json(forumComments.reverse())
  } catch (err) {
    res.status(500).json({ success: false, err })
  }
}

export default getForumComments
