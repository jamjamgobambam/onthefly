import express from 'express'
import { getActivities, getTripActivities, createActivity, deleteActivity, updateActivityLikes } from '../controllers/activities.js'

const router = express.Router()

router.get('/', getActivities)
router.get('/:trip_id', getTripActivities)
router.post('/:trip_id', createActivity)
router.delete('/:id', deleteActivity)
router.patch('/:id', updateActivityLikes)

export default router
