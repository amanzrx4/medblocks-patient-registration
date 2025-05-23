import type { PGliteWorkerWithLive } from '@/utils'
import { faker } from '@faker-js/faker'

export async function seedData(count: number, db: PGliteWorkerWithLive) {
  for (let i = 0; i < count; i++) {
    const registrationDateTime = new Date().toISOString()
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const sex = faker.helpers.arrayElement(['male', 'female', 'other'])
    const dob = faker.date.anytime().toISOString().split('T')[0]
    const phoneNumber = '+91' + '0000000000'
    const email = faker.internet.email({ firstName, lastName }).toLowerCase()
    const addressLine1 = faker.location.streetAddress()
    const addressLine2 = faker.location.secondaryAddress()
    const city = faker.location.city()
    const state = faker.location.state()
    const postalCode = faker.location.zipCode()
    const reason = faker.lorem.sentence()
    const additionalNotes = faker.lorem.paragraph()
    const patientHistory = faker.lorem.paragraphs(2)
    const keyValuePairs = {
      insurance: faker.person.firstName(),
      emergency_contact: faker.person.fullName()
    }

    const query = `
  INSERT INTO patients (
    registration_datetime,
    key_value_pairs,
    first_name,
    last_name,
    sex,
    dob,
    phone_number,
    email,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    reason,
    additional_notes,
    patient_history
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8,
    $9, $10, $11, $12, $13, $14, $15, $16
  );
`

    const values = [
      registrationDateTime,
      JSON.stringify(keyValuePairs),
      firstName,
      lastName,
      sex,
      dob,
      phoneNumber,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      reason,
      additionalNotes,
      patientHistory
    ]

    console.log(`inserting data`, {
      registrationDateTime,
      firstName,
      lastName,
      sex,
      dob,
      phoneNumber,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      reason,
      additionalNotes,
      patientHistory,
      keyValuePairs
    })

    await db.query(query, values)
  }
}
