import { getServices, setupDependencies } from "@/infra/di/setup"
import { swaggerRoute, swaggerSpec } from "@/swagger"
import { Hono } from "hono"

// Setup dependency injection
setupDependencies()
const { logger, userHandler } = getServices()

const app = new Hono()
const v1 = new Hono()

// User routes
const userGroupApi = new Hono()
userGroupApi.get("/", userHandler.getUsers.bind(userHandler, logger))
userGroupApi.get("/:id", userHandler.getUserById.bind(userHandler))

// Register group routes
v1.route("/users", userGroupApi)

v1.get("/health", c => c.json({ status: "ok" }))
app.route("/api/v1", v1)

// OpenAPI specification endpoint
app.route("/docs", swaggerRoute)
app.get("/openapi.json", c => {
  return c.json(swaggerSpec)
})

export default app
