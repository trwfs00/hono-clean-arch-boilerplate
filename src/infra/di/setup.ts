import { UserHandler } from "@/api/handlers/users"
import { UserRepository, UserRepositoryImpl } from "@/api/repositories/user"
import { UserService } from "@/api/services/user/user"
import {
  DatabaseService,
  DatabaseServiceImpl,
} from "@/infra/database/connection"
import { Logger } from "pino"
import { logger } from "../logging/logger"
import { container, TOKENS } from "./container"

/**
 * Configure all dependency injections
 */
export function setupDependencies(): void {
  // infra services
  container.register<Logger>(TOKENS.LOGGER, () => logger, { singleton: true })
  container.register<DatabaseService>(
    TOKENS.DATABASE,
    () => new DatabaseServiceImpl(),
    { singleton: true }
  )

  // Handlers
  container.register<UserHandler>(
    TOKENS.USER_HANDLER,
    () => {
      const userService = container.resolve<UserService>(TOKENS.USER_SERVICE)
      return new UserHandler(userService)
    },
    { singleton: true }
  )

  // Services
  container.register<UserService>(
    TOKENS.USER_SERVICE,
    () => {
      const logger = container.resolve<Logger>(TOKENS.LOGGER)
      const databaseService = container.resolve<DatabaseService>(
        TOKENS.DATABASE
      )
      const userRepository = container.resolve<UserRepository>(
        TOKENS.USER_REPOSITORY
      )
      return new UserService(logger, databaseService, userRepository)
    },
    { singleton: true }
  )

  // Repositories
  container.register<UserRepository>(
    TOKENS.USER_REPOSITORY,
    () => {
      const logger = container.resolve<Logger>(TOKENS.LOGGER)
      return new UserRepositoryImpl(logger)
    },
    { singleton: true }
  )
}

/**
 * Get configured services from container
 */
export function getServices() {
  return {
    databaseService: container.resolve<DatabaseService>(TOKENS.DATABASE),
    logger: container.resolve<Logger>(TOKENS.LOGGER),

    // Handlers
    userHandler: container.resolve<UserHandler>(TOKENS.USER_HANDLER),

    // Services
    userService: container.resolve<UserService>(TOKENS.USER_SERVICE),

    // Repositories
    userRepository: container.resolve<UserRepository>(TOKENS.USER_REPOSITORY),
  }
}
