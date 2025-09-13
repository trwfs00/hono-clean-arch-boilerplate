import { serve } from "@hono/node-server"
import app from "./api/router"
import { logger } from "./infra/logging/logger"

const port = process.env.PORT ? Number(process.env.PORT) : 3000

serve({
  fetch: app.fetch,
  port,
})

logger.info(`🚀 Server running at http://localhost:${port}`)
