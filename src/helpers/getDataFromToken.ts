// src/helpers/getDataFromToken.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest): string | null => {
    try {
        const token = request.headers.get("authorization")?.split(" ")[1] || "";
        if (!token) {
            return null;
        }
        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
        // Return the user's ID from the token
        return decodedToken.id;
    } catch (error: any) {
        // It's common for tokens to expire, so we just return null
        console.error("JWT Verification Error:", error.message);
        return null;
    }
};