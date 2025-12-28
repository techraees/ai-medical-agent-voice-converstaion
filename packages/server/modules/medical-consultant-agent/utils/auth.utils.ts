import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

export interface TokenPayload {
   userId: string
   email: string
   role: string
}

export const generateAccessToken = (payload: TokenPayload): string => {
   return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
   })
}

export const generateRefreshToken = (payload: TokenPayload): string => {
   return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
   })
}

export const verifyAccessToken = (token: string): TokenPayload => {
   return jwt.verify(token, JWT_SECRET) as TokenPayload
}

export const verifyRefreshToken = (token: string): TokenPayload => {
   return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload
}

export const hashPassword = async (password: string): Promise<string> => {
   const salt = await bcrypt.genSalt(10)
   return await bcrypt.hash(password, salt)
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
   return await bcrypt.compare(password, hashedPassword)
}
