import type { NextApiRequest, NextApiResponse } from 'next'
import { storage } from '@/lib/storage'  // You'll need to copy this from server/storage.ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      const venues = await storage.getAllVenues()
      return res.json(venues)

    case 'POST':
      const venue = await storage.createVenue(req.body)
      return res.status(201).json(venue)

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}