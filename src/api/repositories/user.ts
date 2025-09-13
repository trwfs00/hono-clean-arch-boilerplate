import { User } from "@/const/types/user"
import { DatabaseService } from "@/infra/database/connection"
import { users } from "@/infra/database/entity/user"
import { Logger } from "pino"

export interface UserRepository {
  getUsers(
    databaseService: DatabaseService
  ): Promise<{ data: User[]; error: boolean }>
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private logger: Logger) {}

  async getUsers(databaseService: DatabaseService) {
    try {
      const db = databaseService.getDb()
      const result = await db.select().from(users)
      return { data: result, error: false }
    } catch (error) {
      this.logger.error("can not get users")
      return { data: [], error: true }
    }
  }
}
