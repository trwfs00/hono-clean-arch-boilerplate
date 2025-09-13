import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

export interface DatabaseService {
  getDb(): ReturnType<typeof drizzle>
}

export class DatabaseServiceImpl implements DatabaseService {
  private db: ReturnType<typeof drizzle>

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })
    this.db = drizzle(pool)
  }

  getDb() {
    return this.db
  }
}

// Keep backward compatibility for now
const databaseService = new DatabaseServiceImpl()
export const db = databaseService.getDb()
