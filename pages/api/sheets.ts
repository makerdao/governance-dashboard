import { NextApiRequest, NextApiResponse } from 'next'

const SPREADSHEET_ID = '1LWNlv6hr8oXebk8rvXZBPRVDjN-3OrzI0IgLwBVk0vM'
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY || ''

const getSheetsData = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const sheetsRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Tracker!A:I?key=${API_KEY}`
    )

    if (!sheetsRes.ok) throw 'Error fetching Google Sheets data'

    const data = await sheetsRes.json()
    const proposalItems = data.values.slice(2).map((item) => ({
      title: item[5],
      endDate: new Date(item[1]),
      forum: item[6],
      impact: item[4],
      type: item[2].split(' - ')[1],
      activityStatus: item[2].split(' - ')[2],
      class: item[3],
      poll: item[7] || '',
      executive: item[8] || '',
    }))

    const formattedProposalItems = {
      executive: proposalItems.filter((item) => item.type === 'Executive'),
      onChainPolls: proposalItems.filter(
        (item) => item.type === 'On-Chain Poll'
      ),
      offChainPolls: proposalItems.filter(
        (item) => item.type === 'Off-Chain Poll'
      ),
      forumDiscussions: proposalItems.filter((item) =>
        ['Notification', 'Informal Poll', 'Forum Discussion'].includes(
          item.type
        )
      ),
    }

    res.status(200).json(formattedProposalItems)
  } catch (err) {
    res.status(500).json({ success: false, err })
  }
}

export default getSheetsData
