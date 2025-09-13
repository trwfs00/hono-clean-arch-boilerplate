export type ErrorCode = {
  code: string
  message: string
}

const featOrTabDigit = 2
const caseDigit = 2

export const New = (
  featOrTabNum: number,
  caseNum: number,
  msg: string
): ErrorCode => {
  return {
    code: `${featOrTabNum.toString().padStart(featOrTabDigit, "0")}${caseNum
      .toString()
      .padStart(caseDigit, "0")}`,
    message: msg,
  }
}
