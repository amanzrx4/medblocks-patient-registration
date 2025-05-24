const express = require('express')
const { Pool } = require('pg')
const path = require('path')

const app = express()

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '',
  port: 5432
})

pool.connect((err, client, release) => {
  if (err) {
    console.error('DB connection failed:', err)
  } else {
    console.log('DB connected')
    release()
  }
})

pool
  .query(
    `
    CREATE TABLE IF NOT EXISTS photos (
        id SERIAL PRIMARY KEY,
        photo BYTEA NOT NULL
    )
`
  )
  .then(() => {
    console.log('Table ready')
  })
  .catch((err) => {
    console.error('Table creation failed:', err)
  })

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.post(
  '/upload',
  express.raw({ type: 'image/*', limit: '10mb' }),
  async (req, res) => {
    console.log('Photo upload request')
    console.log('Content-Type:', req.get('Content-Type'))
    console.log('Buffer size:', req.body?.length)

    if (!req.body || req.body.length === 0) {
      return res.status(400).send('No photo data')
    }

    try {
      await pool.query('INSERT INTO photos (photo) VALUES ($1)', [req.body])
      console.log('Photo binary data saved to DB')
      res.send('Photo uploaded')
    } catch (err) {
      console.error('Upload failed:', err)
      res.status(500).send('Upload failed')
    }
  }
)

app.get('/photos', async (req, res) => {
  console.log('Photos request')

  try {
    const result = await pool.query(
      'SELECT id, photo FROM photos ORDER BY id DESC'
    )
    const photos = result.rows.map((row) => ({
      id: row.id,
      photo: row.photo.toString('base64')
    }))
    console.log(`Retrieved ${photos.length} photos`)
    res.json(photos)
  } catch (err) {
    console.error('Fetch failed:', err)
    res.status(500).send('Fetch failed')
  }
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
