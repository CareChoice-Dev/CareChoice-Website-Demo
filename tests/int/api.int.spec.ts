import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

// SKIPPED: this Payload integration test boots a real DB via the local Payload
// init and hits 127.0.0.1:5432. We use Neon (managed cloud Postgres), so there
// is no local server. Re-enable once we either:
//   1. spin up a local Postgres container in CI; or
//   2. point this test at a separate Neon "test" branch via TEST_DATABASE_URL.
// Tracked as Plan 2 carry-over from Plan 1.
describe.skip('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })
})
