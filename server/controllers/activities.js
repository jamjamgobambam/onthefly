import { pool } from '../config/database.js'

const createActivitiesTableQuery = `
    CREATE TABLE IF NOT EXISTS activities (
        id serial PRIMARY KEY,
        trip_id int NOT NULL,
        activity varchar(100) NOT NULL,
        num_votes integer DEFAULT 0,
        FOREIGN KEY(trip_id) REFERENCES trips(id)
    );
`

pool.query(createActivitiesTableQuery, (error, res) => {
    if (error) {
        console.log(error)
        return
    }

    console.log('✅ activities table created successfully!')
})

export const createActivity = async (req, res) => {
    try {
        const trip_id = parseInt(req.params.trip_id)
        const { activity } = req.body

        const results = await pool.query(`
            INSERT INTO activities ( activity, trip_id )
            VALUES($1, $2)
            RETURNING *`,
            [activity, trip_id]
        )

        response.status(201).json(results.rows[0])
        console.log('🆕 new activity created')
     }

    catch (error) {
        response.status(409).json( { error: error.message } )
        console.log('Error:', error.message)
    }

}

export const getActivities = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM activities ORDER BY id ASC')
        res.status(200).json(results.rows)
        console.log(results.rows)
    } catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('🚫 Unable to GET all activities - Error:', error.message)
    }
}

export const getTripActivities = async (req, res) => {
    try {
        const trip_id = parseInt(req.params.trip_id)
        const results = await pool.query('SELECT * FROM activities WHERE trip_id = $1', [trip_id])
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('🚫 Unable to GET all trips - Error:', error.message)
    }
}

export const updateActivityLikes = async (req, res) => {
    try {
        const { num_votes } = req.body
        const id = parseInt(req.params.id)
    
        const results = await pool.query(`
            UPDATE activities
            SET num_votes = $1
            WHERE id = $2`,
            [parseInt(num_votes), id]
        )

        res.status(200).json(results.rows)
        console.log('✨ Vote count updated!')
    }
    catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('🚫 Unable to update vote count - Error:', error.message)
    }

}

export const deleteActivity = async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const results = await pool.query('DELETE FROM activities WHERE id = $1', [id])
        res.status(200).json(results.rows)
        console.log('❌ activity deleted')
    }
    catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('🚫 Unable to delete activity - Error:', error.message)
    }
}
