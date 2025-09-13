import { UserRepository } from "@/api/repositories/user"
import { DatabaseService } from "@/infra/database/connection"
import { Logger } from "pino"
import { UsersQueryService, UsersQueryServiceImpl } from "./query/users"

export class UserService {
  public usersQuery: UsersQueryService

  constructor(
    private logger: Logger,
    private databaseService: DatabaseService,
    private userRepository: UserRepository
  ) {
    // Create UsersQueryServiceImpl with injected dependencies
    this.usersQuery = new UsersQueryServiceImpl(
      this.logger,
      this.databaseService,
      this.userRepository
    )
  }
}
