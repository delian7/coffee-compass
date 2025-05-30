import type { NextApiRequest, NextApiResponse } from 'next'
import { storage } from '@/lib/storage'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = parseInt(req.query.id as string, 10)

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid venue ID' })
  }

  try {
    switch (req.method) {
      case 'GET':
        const venue = await storage.getVenueById(id)
        if (!venue) return res.status(404).json({ message: 'Venue not found' })
        return res.json(venue)

      case 'PATCH':
        const updatedVenue = await storage.updateVenue(id, req.body)
        if (!updatedVenue) return res.status(404).json({ message: 'Venue not found' })
        return res.json(updatedVenue)

      case 'DELETE':
        const deleted = await storage.deleteVenue(id)
        if (!deleted) return res.status(404).json({ message: 'Venue not found' })
        return res.status(204).end()

      default:
        res.setHeader('Allow', ['GET', 'PATCH', 'DELETE'])
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('Error handling venue:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}