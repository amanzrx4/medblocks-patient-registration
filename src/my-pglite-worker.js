import { PGlite } from '@electric-sql/pglite'
import { worker } from '@electric-sql/pglite/worker'
import { live } from '@electric-sql/pglite/live'
import { DB_NAME } from './utils'

worker({
  async init() {
    return new PGlite({
      dataDir: `idb://${DB_NAME}`,
      extensions: {
        live
      }
    })
  }
})
