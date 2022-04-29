import { NextApiRequest, NextApiResponse } from 'next'

const SPREADSHEET_ID = '1LWNlv6hr8oXebk8rvXZBPRVDjN-3OrzI0IgLwBVk0vM'
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY || ''

const getSheetsData = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const sheetsRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Archive!A:H?key=${API_KEY}`
    )

    if (!sheetsRes.ok) throw 'Error fetching Google Sheets data'

    const data = await sheetsRes.json()
    const proposalItems = data.values.slice(2).map((item: any) => ({
      title: item[4],
      endDate: new Date(item[0] + ' UTC'),
      forum: item[5],
      impact: item[3],
      status: item[1].split(' - ').slice(1).join(' - '),
      class: item[2],
      poll: item[6] || '',
      executive: item[7] || '',
    }))

    res.status(200).json(proposalItems)
  } catch (err) {
    res.status(500).json({ success: false, err })
  }
}

export default getSheetsData
