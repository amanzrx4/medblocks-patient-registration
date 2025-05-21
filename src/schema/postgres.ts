import sql from 'sql-template-tag'

export const createTableSchema = sql`CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    registration_datetime TIMESTAMPTZ NOT NULL,
    -- keyvalue pair for saving some additional data
    key_value_pairs JSONB,
    first_name TEXT NOT NULL,
    last_name TEXT,
    sex TEXT NOT NULL CHECK (sex IN ('male', 'female', 'other')),
    dob DATE NOT NULL,
    phone_number VARCHAR(15) NOT NULL CHECK (LENGTH(phone_number) >= 10),
    email TEXT NOT NULL CHECK (
        email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    ),
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    -- postal code can have characters too.
    postal_code INTEGER NOT NULL,
    reason TEXT NOT NULL,
    additional_notes TEXT,
    patient_history TEXT,
    -- max 5MB photo
    photo BYTEA CHECK (octet_length(photo) <= 5 * 1024 * 1024),
    created_at TIMESTAMPTZ DEFAULT NOW()
);`
