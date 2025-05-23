import type { LiveNamespace } from "@electric-sql/pglite/live"
import type { PGliteWorker } from "@electric-sql/pglite/worker"

export type PGliteWorkerWithLive = PGliteWorker & {
  live: LiveNamespace
}
