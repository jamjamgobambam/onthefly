import express from 'express'
import { getTripsDestinations, getAllTrips, getAllDestinations, createTripDestination } from '../controllers/trips-destinations.js'

const router = express.Router()

router.get('/', getTripsDestinations)
router.get('/trips/:destination_id', getAllTrips)
router.get('/destinations/:trip_id', getAllDestinations)
router.post('/', createTripDestination)

export default router
