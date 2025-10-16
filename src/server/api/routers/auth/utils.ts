import { User } from "@prisma/client"
import { UserOutput } from "./schemas/validation"

export function excludePassword(user: User): UserOutput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}
