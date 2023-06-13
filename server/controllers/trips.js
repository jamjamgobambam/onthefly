import { pool } from '../config/database.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const currentPath = fileURLToPath(import.meta.url)
const tripsData = fs.readFileSync(path.join(dirname(currentPath), '../config/data/data.json'))
const trips = JSON.parse(tripsData)

const createTripsTableQuery = `
    CREATE TABLE IF NOT EXISTS trips (
        id serial PRIMARY KEY,
        title varchar(100) NOT NULL,
        description varchar(500) NOT NULL,
        img_url text NOT NULL,
        num_days integer NOT NULL,
        start_date date NOT NULL,
        end_date date NOT NULL,
        total_cost money NOT NULL
    );

    TRUNCATE TABLE trips RESTART IDENTITY CASCADE;
`

pool.query(createTripsTableQuery, (error, res) => {
    if (error) {
        console.log(error)
        return
    }

    console.log('✅ trips table created successfully!')

    trips.forEach((item) => {
        const { title, description, img_url, num_days, start_date, end_date, total_cost } = item

        const query = {
            text: 'INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            values: [title, description, img_url, num_days, start_date, end_date, total_cost]
        }
    
        pool.query(query, (error, res) => {
            if (error) {
                console.log(error)
                return
            }
    
            console.log(`Trip ${title} added successfully!`)
        })
    })
})

export const createTrip = async (req, res) => {
    try {
        const { title, description, img_url, num_days, start_date, end_date, total_cost } = req.body

        const results = await pool.query(`
            INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [title, description, img_url, num_days, start_date, end_date, total_cost]
        )

        const tripUser = await pool.query(`
            INSERT INTO users_trips (trip_id, username)
            VALUES($1, $2)
            RETURNING *`,
            [results.rows[0].id, username]
        )

        res.status(201).json(results.rows[0])
        console.log('🆕 new trip created')
     }

    catch (error) {
        response.status(409).json( { error: error.message } )
        console.log('Error:', error.message)
    }
}

export const getTrips = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM trips ORDER BY id ASC')
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('🚫 Unable to GET all trips - Error:', error.message)
    }
}

export const getTrip = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const results = await pool.query('SELECT * FROM trips WHERE id = $1', [id])
        res.status(200).json(results.rows[0])        
    } catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('🚫 Unable to get trip - Error:', error.message)
    }
}

export const updateTrip = async (req, res) => {
    try {
        const { title, description, img_url, num_days, start_date, end_date, total_cost } = req.body
        const id = parseInt(req.params.id)
    
        const results = await pool.query(`
            UPDATE trips SET title = $1, description = $2, img_url = $3, num_days = $4, start_date = $5, end_date = $6, total_cost= $7 WHERE id = $8`,
            [title, description, img_url, num_days, start_date, end_date, total_cost, id]
        )

        res.status(200).json(results.rows)
        console.log('✨ trip updated')      
    }
    catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('🚫 Unable to update trip - Error:', error.message)
    }
}

export const deleteTrip = async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const activity_deletion = await pool.query('DELETE FROM activities WHERE trip_id = $1', [id])
        const user_removal = await pool.query('DELETE FROM users_trips WHERE trip_id = $1', [id])
        const destination_removal = await pool.query('DELETE FROM trips_destinations WHERE trip_id = $1', [id])
        const results = await pool.query('DELETE FROM trips WHERE id = $1', [id])

        console.log('❌ trip deleted')

        res.status(200).json(results.rows)
    }
    catch (error) {
        res.status(409).json( { error: error.message } )
    }
}
