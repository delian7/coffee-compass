import type { NextApiRequest, NextApiResponse } from 'next'
import { storage } from '@/lib/storage'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` })
  }

  try {
    await storage.refreshVenuesFromGoogleSheets()
    const venues = await storage.getAllVenues()
    return res.json({
      message: "Venues refreshed successfully",
      count: venues.length
    })
  } catch (error) {
    console.error("Error refreshing venues:", error)
    return res.status(500).json({
      message: "Failed to refresh venues from Google Sheets"
    })
  }
}