import express from 'express'
import { getDestinations, getDestination, createDestination, deleteDestination, updateDestination } from '../controllers/destinations.js'

const router = express.Router()

router.get('/', getDestinations)
router.get('/:id', getDestination)
router.post('/', createDestination)
router.delete('/:id', deleteDestination)
router.patch('/:id', updateDestination)

export default router
