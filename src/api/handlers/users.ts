import { UserService } from "@/api/services/user/user"
import { basicError } from "@/const/basicError"
import { HTTP_STATUS } from "@/const/enum/httpStatus"
import { Context } from "hono"
import { Logger } from "pino"

export class UserHandler {
  constructor(private userService: UserService) {}

  async getUsers(logger: Logger, c: Context) {
    try {
      const { data, error } = await this.userService.usersQuery.getUsers()
      if (error) {
        logger.error(error.message)
        return c.json(error, HTTP_STATUS.BAD_REQUEST)
      }
      return c.json(data)
    } catch (error) {
      return c.json(basicError)
    }
  }

  async getUserById(c: Context) {
    // Placeholder for getUserById implementation
    return c.json(
      {
        ok: false,
        code: "NOT_IMPLEMENTED",
        message: "getUserById not implemented yet",
      },
      501
    )
  }
}
