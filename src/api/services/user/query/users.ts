import { UserRepository } from "@/api/repositories/user"
import { CUSTOM_ERROR } from "@/const/enum/errorCodes"
import { ReturnError } from "@/const/types/errors/ReturnError"
import { User } from "@/const/types/user"
import { DatabaseService } from "@/infra/database/connection"
import { Logger } from "pino"

export interface UsersQueryService {
  getUsers(): Promise<{ data: User[]; error: ReturnError }>
}

export class UsersQueryServiceImpl implements UsersQueryService {
  constructor(
    private logger: Logger,
    private databaseService: DatabaseService,
    private userRepository: UserRepository
  ) {}

  async getUsers() {
    const { data, error } = await this.userRepository.getUsers(
      this.databaseService
    )
    if (error) {
      const customErr = CUSTOM_ERROR.USER.GET_USERS_INTERNAL_ERROR
      this.logger.error(customErr.message)
      return { data: [], error: customErr }
    }
    return { data, error: null }
  }
}
