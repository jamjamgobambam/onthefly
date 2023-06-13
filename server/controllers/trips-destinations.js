import { pool } from '../config/database.js'

const createTripsDestinationsTableQuery = `
    CREATE TABLE IF NOT EXISTS trips_destinations (
        trip_id int NOT NULL,
        destination_id int NOT NULL,
        PRIMARY KEY (trip_id, destination_id),
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
        FOREIGN KEY (destination_id) REFERENCES destinations(id) ON UPDATE CASCADE
    );
`

pool.query(createTripsDestinationsTableQuery, (error, res) => {
    if (error) {
        console.log(error)
        return
    }

    console.log('✅ trips-destinations table created successfully!')
})

export const createTripDestination = async (req, res) => {
    try {
        const { trip_id, destination_id } = req.body

        const results = await pool.query(`
            INSERT INTO trips_destinations (trip_id, destination_id)
            VALUES($1, $2)
            RETURNING *`,
            [trip_id, destination_id]
        )

        res.status(201).json(results.rows[0])
        console.log('🆕 New trip destination created')
    }
    catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('Error:', error.message)
    }
}

export const getTripsDestinations = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM trips_destinations ORDER BY trip_id ASC')
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('🚫 Unable to GET all trip destinations - Error:', error.message)
    }
}

export const getAllTrips = async (req, res) => {
    try {
        const destination_id = parseInt(req.params.destination_id)

        const results = await pool.query(`
            SELECT t.* FROM trips_destinations td, trips t
            WHERE td.trip_id = t.id AND td.destination_id = $1`,
            [destination_id]
        )

        res.status(200).json(results.rows)        
    } catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('🚫 Unable to get trips with matching destination - Error:', error.message)
    }
}

export const getAllDestinations  = async (req, res) => {
    try {
        const trip_id = parseInt(req.params.trip_id)

        const results = await pool.query(`
            SELECT d.* FROM trips_destinations td, destinations d
            WHERE td.destination_id = d.id AND td.trip_id = $1`,
            [trip_id]
        )

        res.status(200).json(results.rows)        
    } catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('🚫 Unable to get destinations for given trip - Error:', error.message)
    }
}
