import "dotenv/config"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/infra/database/entity/*",
  out: "./src/infra/database/migration",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
