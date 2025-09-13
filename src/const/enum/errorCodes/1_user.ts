import { New } from "./base"

const featUserNum = 1

export const userErrorCodes = {
  // region handler 0-499
  INVALID_BODY: New(featUserNum, 0, "User invalid body"), // 1000
  INVALID_PARAMS: New(featUserNum, 1, "User invalid params"), // 1001
  // endregion

  // region service 500-999
  GET_USERS_INTERNAL_ERROR: New(featUserNum, 500, "Get users internal error"), // 1500
  GET_USERS_NOT_FOUND: New(featUserNum, 501, "Get users not found"),
  GET_USERS_INVALID_REQUEST: New(featUserNum, 502, "Get users invalid request"),
  GET_USERS_UNAUTHORIZED: New(featUserNum, 503, "Get users unauthorized"), // 1503
  GET_USERS_FORBIDDEN: New(featUserNum, 504, "Get users forbidden"), // 1504
  GET_USERS_TOO_MANY_REQUESTS: New(
    featUserNum,
    505,
    "Get users too many requests"
  ), // 1505
  // endregion
}
