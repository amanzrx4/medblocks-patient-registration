import { PGlite } from '@electric-sql/pglite'
import { worker } from '@electric-sql/pglite/worker'
import { live } from '@electric-sql/pglite/live'

worker({
  async init() {
    return new PGlite({
      dataDir: 'idb://test1',
      extensions: {
        live
      }
    })
  }
})
