import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'

/**
 * Parse a JWT token and return a user id
 * @param header auth header
 * @returns a user id from the JWT token
 */
export function parseUserId(header: string): string {
  console.log(header);
  const split = header.split(' ')
  const jwtToken = split[1]
  console.log(jwtToken);
  const decodedJwt = decode(jwtToken) as JwtPayload;
  return decodedJwt.sub
}
