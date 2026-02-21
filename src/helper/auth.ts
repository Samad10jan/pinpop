import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


export const hashPassword = (p: string) => bcrypt.hash(p, 10);
export const verifyPassword = bcrypt.compare;

export const signAccess = (id: string) =>
    jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "15m" });

export const signRefresh = (id: string) =>
    jwt.sign({ id }, process.env.REFRESH_SECRET!, { expiresIn: "7d" });

export const verifyAccess = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    } catch {
        return null
    }
}

export const verifyRefresh = (token: string) => {
    try {
        return jwt.verify(token, process.env.REFRESH_SECRET!) as { id: string }
    } catch {
        return null
    }
}


