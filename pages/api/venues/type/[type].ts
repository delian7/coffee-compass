import type { NextApiRequest, NextApiResponse } from 'next'
import { storage } from '@/lib/storage'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` })
  }

  const type = req.query.type as string
  const validTypes = ['coffee', 'restaurant', 'bar']

  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: 'Invalid venue type' })
  }

  try {
    const venues = await storage.getVenuesByType(type)
    return res.json(venues)
  } catch (error) {
    console.error('Error fetching venues by type:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}